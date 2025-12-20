/**
 * Fax Utility
 * Support for SRFax and Nextiva API Integrations
 */

// Placeholder for Nextiva Web SDK
// Documentation: https://www.nextiva.com/developers/
// Installation: npm install @nextiva/ncx-web-sdk

// Placeholder for SRFax REST API
// Documentation: https://www.srfax.com/fax-api/

export interface FaxOptions {
    to: string;
    file?: Buffer | string;
    senderName?: string;
    priority?: 'NORMAL' | 'HIGH';
}

export async function sendViaSRFax(options: {
    accountId: string;
    password: string;
    recipient: string;
    sender: string;
    priority: string;
    file: string;
}) {
    const { accountId, password, recipient, file } = options;

    const formData = new URLSearchParams();
    formData.append('action', 'Queue_Fax');
    formData.append('access_id', accountId);
    formData.append('access_pwd', password);
    formData.append('sToFaxNumber', recipient);
    formData.append('sResponseFormat', 'JSON');

    if (file) {
        formData.append('sFileName_1', 'fax_document.pdf');
        formData.append('sFileContent_1', file);
    }

    try {
        const response = await fetch('https://www.srfax.com/SRFax2.php', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.Status === 'Success') {
            return { success: true, jobId: result.Result };
        } else {
            return { success: false, error: result.Result };
        }
    } catch (error) {
        console.error('SRFax API Error:', error);
        return { success: false, error: 'Connection failed' };
    }
}

export async function getFaxStatus(jobId: string, accountId: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('action', 'Get_FaxStatus');
    formData.append('access_id', accountId);
    formData.append('access_pwd', password);
    formData.append('sFaxDetailsID', jobId);
    formData.append('sResponseFormat', 'JSON');

    try {
        const response = await fetch('https://www.srfax.com/SRFax2.php', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        return result.Result?.[0]?.Status || 'PENDING';
    } catch {
        return 'UNKNOWN';
    }
}
export async function getFaxDetails(jobId: string, accountId: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('action', 'Get_FaxDetails');
    formData.append('access_id', accountId);
    formData.append('access_pwd', password);
    formData.append('sFaxDetailsID', jobId);
    formData.append('sResponseFormat', 'JSON');

    try {
        const response = await fetch('https://www.srfax.com/SRFax2.php', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        return result.Result?.[0] || null;
    } catch (error) {
        console.error('SRFax API Error:', error);
        return null;
    }
}

export async function getFaxUsage(accountId: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('action', 'Get_FaxUsage');
    formData.append('access_id', accountId);
    formData.append('access_pwd', password);
    formData.append('sResponseFormat', 'JSON');

    try {
        const response = await fetch('https://www.srfax.com/SRFax2.php', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        return result.Result || null;
    } catch (error) {
        console.error('SRFax API Error:', error);
        return null;
    }
}
