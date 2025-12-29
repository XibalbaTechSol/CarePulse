
import React from 'react';
import { Card, Badge, Button } from '@/components/nord';
import { Bot, ChevronRight, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ModuleCardProps {
    id: string;
    name: string;
    description: string;
    category: string;
    icon?: React.ReactNode;
    status?: 'active' | 'inactive' | 'configuring';
    aiCapabilities?: string[];
    href: string;
}

export function ModuleCard({
    id,
    name,
    description,
    category,
    icon,
    status = 'active',
    aiCapabilities = [],
    href
}: ModuleCardProps) {
    const router = useRouter();
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
            <Card.Header>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        {icon}
                        <h3 className="text-xl font-bold">{name}</h3>
                    </div>
                    {status === 'active' && <Badge variant="success">Active</Badge>}
                    {status === 'inactive' && <Badge variant="primary">Inactive</Badge>}
                    {status === 'configuring' && <Badge variant="warning">Configuring</Badge>}
                </div>
                <p className="line-clamp-2 mt-2 text-sm text-nord3 dark:text-nord4">{description}</p>
            </Card.Header>
            <Card.Body>
                {aiCapabilities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {aiCapabilities.map((cap) => (
                            <Badge key={cap} variant="info" className="text-xs flex items-center gap-1">
                                <Bot size={12} />
                                {cap}
                            </Badge>
                        ))}
                    </div>
                )}
            </Card.Body>
            <Card.Footer className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/settings/modules/${id}`)}>
                    <Settings className="mr-2 h-4 w-4" /> Configure
                </Button>
                <Button size="sm" onClick={() => router.push(href)}>
                    Open Module <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </Card.Footer>
        </Card>
    );
}
