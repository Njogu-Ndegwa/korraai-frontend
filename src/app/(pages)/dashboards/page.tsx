'use client'
import React, { useState, useEffect } from 'react';
import {
    MessageCircle,
    BarChart3,
    Bot,
    LucideIcon,
    TrendingUp,
    Clock,
    Zap
} from 'lucide-react';

interface Stat {
    label: string;
    value: string;
    change: string;
    color: string;
    icon: LucideIcon;
}

interface RealTimeMetrics {
    success: boolean;
    metrics: {
        active_conversations: number;
        recent_activity: {
            messages_last_5min: number;
            ai_messages_last_hour: number;
            human_messages_last_hour: number;
        };
        response_queue: {
            waiting_for_response: number;
        };
        timestamp: string;
    };
}

interface StatusOverview {
    success: boolean;
    data: {
        conversation_counts: {
            total: number;
            active: number;
            pending: number;
            resolved: number;
            closed: number;
            status_distribution: {
                active_percentage: number;
                pending_percentage: number;
                resolved_percentage: number;
                closed_percentage: number;
            };
        };
        attention_required: {
            urgent_pending: number;
            needing_response: number;
            overdue: number;
            total_requiring_attention: number;
        };
        handler_distribution: {
            ai_handled: number;
            human_handled: number;
            ai_percentage: number;
            human_percentage: number;
            ai_paused: number;
        };
        response_times: {
            average_ai_response_minutes: number;
            average_human_response_minutes: number;
            overall_average_minutes: number;
            ai_response_count: number;
            human_response_count: number;
            performance_comparison: {
                ai_faster: boolean;
                speed_difference_minutes: number;
            };
        };
        platform_breakdown: {
            whatsapp: number;
            whatsapp_new: number;
            whatsapp_newest: number;
        };
        recent_activity: {
            new_conversations_24h: number;
            resolved_conversations_24h: number;
            average_resolution_time_hours: number;
        };
        generated_at: string;
        time_range: {
            start: string;
            end: string;
        };
    };
}
const token = localStorage.getItem('access_token') || '';
const DashboardContent = () => {
    const [realTimeData, setRealTimeData] = useState<any>(null);
    const [statusData, setStatusData] = useState<StatusOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRealTimeMetrics = async () => {
        try {
            
                const response = await fetch('https://korraai.bitwavetechnologies.com/api/conversations/real-time-metrics/', {
                method: 'GET', // or 'POST', etc.
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch real-time metrics');
            const data: RealTimeMetrics = await response.json();
            setRealTimeData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch real-time metrics');
        }
    };

    const fetchStatusOverview = async () => {
        try {
            const response = await fetch('https://korraai.bitwavetechnologies.com/api/conversations/status-overview/', {
                method: 'GET', // or 'POST', etc.
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch status overview');
            const data: StatusOverview = await response.json();
            setStatusData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch status overview');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            await Promise.all([fetchRealTimeMetrics(), fetchStatusOverview()]);
        } catch (err) {
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Set up automatic refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);

        return () => clearInterval(interval);
    }, []);

    // Calculate percentage changes (mock for now - you can implement historical comparison)
    const calculateChange = (current: number, previous: number = current * 0.9): string => {
        if (previous === 0) return '+0%';
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
    };

    const formatResponseTime = (minutes: number): string => {
        if (minutes < 1) {
            return `${(minutes * 60).toFixed(1)}s`;
        } else if (minutes < 60) {
            return `${minutes.toFixed(1)}m`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = Math.floor(minutes % 60);
            return `${hours}h ${remainingMinutes}m`;
        }
    };

    const generateStats = (): Stat[] => {
        if (!realTimeData || !statusData) {
            // Return default stats while loading
            return [
                { label: 'Total Conversations', value: '...', change: '...', color: 'blue', icon: MessageCircle },
                { label: 'Active Chats', value: '...', change: '...', color: 'green', icon: Zap },
                { label: 'AI Responses', value: '...', change: '...', color: 'purple', icon: Bot },
                { label: 'Response Time', value: '...', change: '...', color: 'orange', icon: Clock }
            ];
        }

        return [
            {
                label: 'Total Conversations',
                value: statusData.data.conversation_counts.total.toString(),
                change: calculateChange(statusData.data.conversation_counts.total),
                color: 'blue',
                icon: MessageCircle
            },
            {
                label: 'Active Chats',
                value: realTimeData.metrics.active_conversations.toString(),
                change: calculateChange(realTimeData.metrics.active_conversations),
                color: 'green',
                icon: Zap
            },
            {
                label: 'AI Responses',
                value: statusData.data.response_times.ai_response_count.toString(),
                change: calculateChange(statusData.data.response_times.ai_response_count),
                color: 'purple',
                icon: Bot
            },
            {
                label: 'Avg Response Time',
                value: formatResponseTime(statusData.data.response_times.overall_average_minutes),
                change: statusData.data.response_times.performance_comparison.ai_faster ? '-15%' : '+5%',
                color: 'orange',
                icon: Clock
            }
        ];
    };

    const getStatColors = (color: string) => {
        const colors = {
            blue: 'from-blue-500 to-indigo-600',
            green: 'from-emerald-500 to-teal-600',
            purple: 'from-purple-500 to-pink-600',
            orange: 'from-orange-500 to-red-600'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const getStatBg = (color: string) => {
        const colors = {
            blue: 'bg-blue-50',
            green: 'bg-emerald-50',
            purple: 'bg-purple-50',
            orange: 'bg-orange-50'
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const generateRecentActivity = () => {
        if (!statusData) return [];

        const activities = [];

        if (statusData.data.recent_activity.new_conversations_24h > 0) {
            activities.push({
                message: `${statusData.data.recent_activity.new_conversations_24h} new conversations started`,
                time: 'Last 24 hours'
            });
        }

        if (statusData.data.recent_activity.resolved_conversations_24h > 0) {
            activities.push({
                message: `${statusData.data.recent_activity.resolved_conversations_24h} conversations resolved`,
                time: 'Last 24 hours'
            });
        }

        if (realTimeData?.metrics?.recent_activity?.messages_last_5min > 0) {
            activities.push({
                message: `${realTimeData.metrics.recent_activity.messages_last_5min} messages received`,
                time: 'Last 5 minutes'
            });
        }


        // Add some default activities if none exist
        if (activities.length === 0) {
            activities.push(
                { message: 'AI handling active conversations', time: 'Ongoing' },
                { message: `${statusData?.data.handler_distribution.ai_handled || 0} conversations managed by AI`, time: 'Current' },
                { message: `Response time: ${formatResponseTime(statusData?.data.response_times.average_ai_response_minutes || 0)}`, time: 'Average' }
            );
        }

        return activities.slice(0, 3);
    };

    const stats = generateStats();
    const recentActivity = generateRecentActivity();

    if (error) {
        return (
            <div className="p-6 space-y-6 bg-gray-50 h-full overflow-y-auto">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Dashboard</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchData}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 h-full overflow-y-auto">
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
                        <p className="text-gray-600">Here's what's happening with your conversations today.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="text-sm text-gray-600">
                            {loading ? 'Updating...' : 'Live'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat: Stat, index: number) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-14 h-14 ${getStatBg(stat.color)} bg-gradient-to-br ${getStatColors(stat.color)} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                                <span className={`text-sm px-3 py-1 rounded-full font-bold ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' :
                                        stat.change.startsWith('-') ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Handler Distribution</h3>
                        <TrendingUp size={20} className="text-green-500" />
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        {statusData ? (
                            <div className="text-center w-full">
                                <div className="flex items-center justify-center gap-8 mb-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600 mb-1">
                                            {statusData.data.handler_distribution.ai_handled}
                                        </div>
                                        <div className="text-sm text-gray-600">AI Handled</div>
                                        <div className="text-xs text-purple-600 font-semibold">
                                            {statusData.data.handler_distribution.ai_percentage.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600 mb-1">
                                            {statusData.data.handler_distribution.human_handled}
                                        </div>
                                        <div className="text-sm text-gray-600">Human Handled</div>
                                        <div className="text-xs text-blue-600 font-semibold">
                                            {statusData.data.handler_distribution.human_percentage.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                                        style={{ width: `${statusData.data.handler_distribution.ai_percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl w-full h-full flex items-center justify-center">
                                <div>
                                    <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>Loading chart data...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Response Performance</h3>
                        <Clock size={20} className="text-purple-500" />
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        {statusData ? (
                            <div className="text-center w-full">
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600 mb-1">
                                            {formatResponseTime(statusData.data.response_times.average_ai_response_minutes)}
                                        </div>
                                        <div className="text-sm text-gray-600">AI Avg Response</div>
                                        <div className="text-xs text-green-600 font-semibold">
                                            {statusData.data.response_times.ai_response_count} responses
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600 mb-1">
                                            {formatResponseTime(statusData.data.response_times.average_human_response_minutes)}
                                        </div>
                                        <div className="text-sm text-gray-600">Human Avg Response</div>
                                        <div className="text-xs text-orange-600 font-semibold">
                                            {statusData.data.response_times.human_response_count} responses
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="text-sm text-green-700 font-semibold">
                                        AI is {formatResponseTime(statusData.data.response_times.performance_comparison.speed_difference_minutes)} faster
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl w-full h-full flex items-center justify-center">
                                <div>
                                    <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>Loading performance data...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {recentActivity.map((activity, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700">{activity.message}</p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                    {recentActivity.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            <p>No recent activity</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function DashboardPage() {
  return <DashboardContent />;
}