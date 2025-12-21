import React from 'react';
import { FileText, Grid, List, MoreVertical } from 'lucide-react';

interface FileBrowserProps {
    templates: string[];
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onSelect: (template: string) => void;
}

export default function FileBrowser({ templates, viewMode, onViewModeChange, onSelect }: FileBrowserProps) {
    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 px-4 py-3 glass rounded-xl">
                <h2 className="text-lg font-semibold text-gray-200">My Drive / Templates</h2>
                <div className="flex items-center gap-2 bg-gray-800/50 p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-white/5'}`}
                        title="List view"
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-white/5'}`}
                        title="Grid view"
                    >
                        <Grid size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <FileText size={64} className="mb-4 opacity-20" />
                        <p>No PDF templates found.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2">
                        {templates.map(file => (
                            <div
                                key={file}
                                onClick={() => onSelect(file)}
                                className="group relative flex flex-col glass hover:bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:border-primary/50 aspect-[3/4]"
                            >
                                <div className="flex-1 bg-gray-900/50 flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-300">
                                    <FileText size={64} className="text-gray-400 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="p-4 bg-gray-900/80 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-sm font-medium truncate text-gray-200" title={file}>
                                        {file}
                                    </span>
                                    <button className="p-1 hover:bg-white/10 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 px-2">
                        {templates.map(file => (
                            <div
                                key={file}
                                onClick={() => onSelect(file)}
                                className="flex items-center gap-4 p-4 glass hover:bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-all group"
                            >
                                <div className="p-3 bg-gray-800/50 rounded-lg text-primary/80 group-hover:text-primary">
                                    <FileText size={24} />
                                </div>
                                <span className="flex-1 text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                                    {file}
                                </span>
                                <span className="text-xs text-gray-500">PDF Document</span>
                                <button className="p-2 hover:bg-white/10 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
