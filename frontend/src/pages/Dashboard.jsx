import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import PeopleIcon from '@mui/icons-material/People';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TodayIcon from '@mui/icons-material/Today';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: LeaderboardIcon,
      color: '#1976d2',
      bgColor: '#e3f2fd',
      subtitle: 'All leads in pipeline',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: PeopleIcon,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
      subtitle: 'Active customers',
    },
    {
      title: 'Converted Leads',
      value: stats?.convertedLeads || 0,
      icon: TrendingUpIcon,
      color: '#ed6c02',
      bgColor: '#fff3e0',
      subtitle: 'Successfully closed',
    },
    {
      title: "Today's Leads",
      value: stats?.todayLeads || 0,
      icon: TodayIcon,
      color: '#9c27b0',
      bgColor: '#f3e5f5',
      subtitle: 'New today',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      New: '#2196f3',
      Contacted: '#00bcd4',
      'In Progress': '#ff9800',
      Converted: '#4caf50',
      Lost: '#f44336',
    };
    return colors[status] || '#757575';
  };

  const calculateConversionRate = () => {
    const total = stats?.totalLeads || 0;
    const converted = stats?.convertedLeads || 0;
    return total > 0 ? Math.round((converted / total) * 100) : 0;
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fc', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 }, mt: 8 }}>
        {/* Header with Gradient */}
        <Box 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            p: { xs: 2, sm: 3, md: 4 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: { xs: 2, md: 3 },
            color: 'white',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Typography variant="h3" fontWeight="700" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Welcome back, {user.name || 'User'}! Here's your CRM performance at a glance.
          </Typography>
        </Box>

        {/* Stats Cards */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
              {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    background: 'white',
                    borderRadius: { xs: 2, md: 3 },
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${stat.color}, ${stat.color}dd)`,
                    },
                    '&:hover': {
                      transform: { xs: 'none', md: 'translateY(-8px)' },
                      boxShadow: { xs: 'none', md: `0 12px 40px ${stat.color}30` },
                      border: `1px solid ${stat.color}40`,
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: { xs: 2, md: 3 } }}>
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                          color: 'white',
                          width: { xs: 48, sm: 56, md: 64 },
                          height: { xs: 48, sm: 56, md: 64 },
                          boxShadow: `0 8px 16px ${stat.color}30`,
                        }}
                      >
                        <IconComponent sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
                      </Avatar>
                      {index === 2 && (
                        <Chip
                          icon={<ArrowUpwardIcon sx={{ fontSize: 16 }} />}
                          label={`${calculateConversionRate()}%`}
                          size="small"
                          sx={{ 
                            background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                            color: 'white',
                            fontWeight: 700,
                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="h3" fontWeight="800" sx={{ mb: 1, color: '#1a202c', letterSpacing: '-0.02em', fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5, color: '#2d3748', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#718096', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {stat.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Charts and Details */}
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          {/* Leads by Status */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                height: '100%',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: { xs: 2, md: 3 },
                background: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: { xs: 'none', md: '0 8px 30px rgba(0,0,0,0.12)' },
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    width: { xs: 40, md: 48 },
                    height: { xs: 40, md: 48 },
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <LeaderboardIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                </Box>
                <Typography variant="h6" fontWeight="700" sx={{ color: '#1a202c', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>
                  Leads by Status
                </Typography>
              </Box>
              <Divider sx={{ mb: { xs: 2, md: 3 } }} />
              {stats?.leadsByStatus && Object.keys(stats.leadsByStatus).length > 0 ? (
                <Box>
                  {Object.entries(stats.leadsByStatus).map(([status, count]) => {
                    const total = stats?.totalLeads || 1;
                    const percentage = Math.round((count / total) * 100);
                    return (
                      <Box 
                        key={status} 
                        sx={{ 
                          mb: { xs: 2, md: 3 },
                          p: { xs: 1.5, md: 2 },
                          borderRadius: 2,
                          bgcolor: '#f8f9fc',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: '#f1f3f9',
                            transform: { xs: 'none', md: 'translateX(4px)' },
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1, md: 1.5 }, flexWrap: 'wrap', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: getStatusColor(status),
                                boxShadow: `0 2px 8px ${getStatusColor(status)}40`,
                              }}
                            />
                            <Typography variant="body1" fontWeight="600" sx={{ color: '#2d3748', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              {status}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${count} (${percentage}%)`}
                            size="small"
                            sx={{ 
                              fontWeight: 700,
                              bgcolor: 'white',
                              border: `1px solid ${getStatusColor(status)}30`,
                              color: getStatusColor(status),
                            }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: { xs: 8, md: 10 },
                            borderRadius: 5,
                            bgcolor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(90deg, ${getStatusColor(status)}, ${getStatusColor(status)}dd)`,
                              borderRadius: 5,
                              boxShadow: `0 2px 8px ${getStatusColor(status)}40`,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">No leads data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                height: '100%',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: { xs: 2, md: 3 },
                background: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: { xs: 'none', md: '0 8px 30px rgba(0,0,0,0.12)' },
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    width: { xs: 40, md: 48 },
                    height: { xs: 40, md: 48 },
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)',
                  }}
                >
                  <TodayIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
                </Box>
                <Typography variant="h6" fontWeight="700" sx={{ color: '#1a202c', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>
                  Today's Activity
                </Typography>
              </Box>
              <Divider sx={{ mb: { xs: 2, md: 3 } }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2.5 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 2, md: 3 },
                    p: { xs: 2, md: 3 },
                    background: 'linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)',
                    borderRadius: 2.5,
                    border: '2px solid #e1bee7',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: { xs: 'none', md: 'scale(1.02)' },
                      boxShadow: { xs: 'none', md: '0 8px 24px rgba(156, 39, 176, 0.2)' },
                    }
                  }}
                >
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
                    width: { xs: 48, md: 56 }, 
                    height: { xs: 48, md: 56 },
                    boxShadow: '0 4px 12px rgba(156, 39, 176, 0.4)',
                  }}>
                    <TodayIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight="800" color="#9c27b0" sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                      {stats?.todayLeads || 0}
                    </Typography>
                    <Typography variant="body1" fontWeight="600" sx={{ color: '#6a1b9a', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      New Leads Created Today
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 2, md: 3 },
                    p: { xs: 2, md: 3 },
                    background: 'linear-gradient(135deg, #e8f5e9 0%, #e0f2f1 100%)',
                    borderRadius: 2.5,
                    border: '2px solid #c8e6c9',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: { xs: 'none', md: 'scale(1.02)' },
                      boxShadow: { xs: 'none', md: '0 8px 24px rgba(46, 125, 50, 0.2)' },
                    }
                  }}
                >
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                    width: { xs: 48, md: 56 }, 
                    height: { xs: 48, md: 56 },
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
                  }}>
                    <PeopleIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight="800" color="#2e7d32" sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                      {stats?.todayCustomers || 0}
                    </Typography>
                    <Typography variant="body1" fontWeight="600" sx={{ color: '#1b5e20', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      New Customers Added Today
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 2, md: 3 },
                    p: { xs: 2, md: 3 },
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                    borderRadius: 2.5,
                    border: '2px solid #ffcc80',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: { xs: 'none', md: 'scale(1.02)' },
                      boxShadow: { xs: 'none', md: '0 8px 24px rgba(237, 108, 2, 0.2)' },
                    }
                  }}
                >
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #ed6c02, #ff9800)',
                    width: { xs: 48, md: 56 }, 
                    height: { xs: 48, md: 56 },
                    boxShadow: '0 4px 12px rgba(237, 108, 2, 0.4)',
                  }}>
                    <TrendingUpIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight="800" color="#ed6c02" sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                      {calculateConversionRate()}%
                    </Typography>
                    <Typography variant="body1" fontWeight="600" sx={{ color: '#e65100', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      Conversion Rate
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Admin-only: User Performance Statistics */}
        {isAdmin && stats?.userStats && stats.userStats.length > 0 && (
          <Box sx={{ mt: { xs: 3, sm: 4, md: 5 } }}>
            <Box sx={{ mb: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
              <Box
                sx={{
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
                }}
              >
                <PeopleIcon sx={{ color: 'white', fontSize: { xs: 20, md: 24 } }} />
              </Box>
              <Typography variant="h5" fontWeight="700" sx={{ color: '#1a202c', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Agent Performance
              </Typography>
            </Box>
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
              {stats.userStats.map((userStat) => (
                <Grid item xs={12} md={6} lg={4} key={userStat._id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2.5, sm: 3, md: 3.5 },
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: { xs: 2, md: 3 },
                      height: '100%',
                      background: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: { xs: 'none', md: 'translateY(-4px)' },
                        boxShadow: { xs: 'none', md: '0 12px 40px rgba(0,0,0,0.15)' },
                        border: '1px solid #7c4dff40',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 2, md: 3 } }}>
                      <Avatar sx={{ 
                        background: 'linear-gradient(135deg, #7c4dff, #9c6dff)',
                        width: { xs: 48, md: 56 }, 
                        height: { xs: 48, md: 56 },
                        fontSize: { xs: 20, md: 24 },
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(124, 77, 255, 0.4)',
                      }}>
                        {userStat.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="700" sx={{ color: '#1a202c', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>
                          {userStat.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096', fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                          {userStat.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: { xs: 2, md: 3 } }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.5 } }}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: { xs: 1.5, md: 2 },
                          borderRadius: 2,
                          bgcolor: '#f8f9fc',
                        }}
                      >
                        <Typography variant="body1" fontWeight="600" sx={{ color: '#4a5568', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          Total Leads
                        </Typography>
                        <Typography variant="h5" fontWeight="800" sx={{ color: '#2d3748', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                          {userStat.totalLeads}
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: { xs: 1.5, md: 2 },
                          borderRadius: 2,
                          bgcolor: '#f0fdf4',
                        }}
                      >
                        <Typography variant="body1" fontWeight="600" sx={{ color: '#4a5568', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          Converted Leads
                        </Typography>
                        <Typography variant="h5" fontWeight="800" sx={{ color: '#16a34a', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                          {userStat.convertedLeads}
                        </Typography>
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1, md: 1.5 } }}>
                          <Typography variant="body1" fontWeight="600" sx={{ color: '#4a5568', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Conversion Rate
                          </Typography>
                          <Typography variant="h6" fontWeight="800" sx={{ color: '#2d3748', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}>
                            {userStat.conversionRate.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={userStat.conversionRate}
                          sx={{
                            height: { xs: 8, md: 10 },
                            borderRadius: 5,
                            bgcolor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              background: userStat.conversionRate > 50 
                                ? 'linear-gradient(90deg, #16a34a, #22c55e)' 
                                : userStat.conversionRate > 25 
                                ? 'linear-gradient(90deg, #ea580c, #f97316)' 
                                : 'linear-gradient(90deg, #dc2626, #ef4444)',
                              borderRadius: 5,
                              boxShadow: userStat.conversionRate > 50 
                                ? '0 2px 8px rgba(22, 163, 74, 0.4)'
                                : userStat.conversionRate > 25
                                ? '0 2px 8px rgba(234, 88, 12, 0.4)'
                                : '0 2px 8px rgba(220, 38, 38, 0.4)',
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        </>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;
