import { getOrganizationUsers } from './actions/admin';
import { getCurrentUser } from './auth';

async function test() {
    console.log('Testing getCurrentUser...');
    const user = await getCurrentUser();
    console.log('User:', user);

    console.log('Testing getOrganizationUsers...');
    try {
        const users = await getOrganizationUsers();
        console.log('Users found:', users.length);
    } catch (e) {
        console.error('getOrganizationUsers failed:', e);
    }
}

test().catch(console.error);
