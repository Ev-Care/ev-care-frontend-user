// EVCareAdminDashboard.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MyStatusBar from '../../../components/myStatusBar';

// Define root colors at the top
const COLORS = {
  primary: '#101942',
  accent: '#FF8C00',
  secondary: '#4ECDC4',
  tertiary: '#101942',
  background: '#F8F9FA',
  white: '#FFFFFF',
  gray: '#8A94A6',
  lightGray: '#E0E0E0',
  success: '#4CAF50',
  danger: '#FF3B30',
  
};
const { width } = Dimensions.get('window');

const AdminHome = () => {
  // Dummy data for today's metrics
  const todayData = {
    users: {
      count: 245,
      percentage: 68,
      icon: 'account-group',
      color: COLORS.accent,
    },
    vendors: {
      count: 87,
      percentage: 42,
      icon: 'store',
      color: COLORS.secondary,
    },
    stations: {
      count: 156,
      percentage: 75,
      icon: 'ev-station',
      color: COLORS.tertiary,
    },
  };

  const  legend= ['Users', 'Vendors', 'Stations'];
  // Monthly data for the line chart
  const monthlyData = {
    labels: ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50, 75, 120],
        color: () => COLORS.accent,
        strokeWidth: 2,
      },
      {
        data: [10, 25, 15, 30, 45, 20, 35, 40, 55],
        color: () => COLORS.secondary,
        strokeWidth: 2,
      },
      {
        data: [5, 15, 25, 35, 40, 60, 70, 65, 90],
        color: () => COLORS.tertiary,
        strokeWidth: 2,
      },
    ],
  
  };
  

  // Feature cards data
  const featureCards = [
    {
      title: 'Station Management',
      description: 'Manage all EV stations',
      icon: 'ev-station',
      gradient: [COLORS.primary, '#2A3990'],
    },
    {
      title: 'Verify Vendors',
      description: 'Verify Pending Profiles',
      icon: 'check-decagram',
      gradient: [COLORS.accent, '#FF8A65'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar/>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
          <TouchableOpacity>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Alok Singh</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Icon name="bell-outline" size={24} color={COLORS.primary} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            
          </View>
        </View>

        {/* Today's Report Section */}
        {todaysReport()}

        {/* Monthly Growth Report */}
        { monthlyGrowth()}

        {/* Feature Cards */}
       {featureCardsInfo()}
      </ScrollView>
    </SafeAreaView>
  );

function todaysReport(){
    return(<View style={styles.section}>
      <Text style={styles.sectionTitle}>Today's Report</Text>
      <View style={styles.metricsContainer}>
        {/* Users Today */}
        <View style={styles.metricCard}>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={todayData.users.percentage}
            tintColor={todayData.users.color}
            backgroundColor={COLORS.lightGray}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.metricIconContainer}>
                <Icon name={todayData.users.icon} size={24} color={todayData.users.color} />
              </View>
            )}
          </AnimatedCircularProgress>
          <View style={styles.metricTextContainer}>
            <Text style={styles.metricCount}>{todayData.users.count}</Text>
            <Text style={styles.metricLabel}>Users Today</Text>
            <View style={[styles.percentageBadge, { backgroundColor: todayData.users.color }]}>
              <Text style={styles.percentageText}>{todayData.users.percentage}%</Text>
            </View>
          </View>
        </View>

        {/* Vendors Today */}
        <View style={styles.metricCard}>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={todayData.vendors.percentage}
            tintColor={todayData.vendors.color}
            backgroundColor={COLORS.lightGray}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.metricIconContainer}>
                <Icon name={todayData.vendors.icon} size={24} color={todayData.vendors.color} />
              </View>
            )}
          </AnimatedCircularProgress>
          <View style={styles.metricTextContainer}>
            <Text style={styles.metricCount}>{todayData.vendors.count}</Text>
            <Text style={styles.metricLabel}>Vendors Today</Text>
            <View style={[styles.percentageBadge, { backgroundColor: todayData.vendors.color }]}>
              <Text style={styles.percentageText}>{todayData.vendors.percentage}%</Text>
            </View>
          </View>
        </View>

        {/* Stations Today */}
        <View style={styles.metricCard}>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={todayData.stations.percentage}
            tintColor={todayData.stations.color}
            backgroundColor={COLORS.lightGray}
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.metricIconContainer}>
                <Icon name={todayData.stations.icon} size={24} color={todayData.stations.color} />
              </View>
            )}
          </AnimatedCircularProgress>
          <View style={styles.metricTextContainer}>
            <Text style={styles.metricCount}>{todayData.stations.count}</Text>
            <Text style={styles.metricLabel}>Stations Today</Text>
            <View style={[styles.percentageBadge, { backgroundColor: todayData.stations.color }]}>
              <Text style={styles.percentageText}>{todayData.stations.percentage}%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>);
  }
function monthlyGrowth(){
   return( <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Monthly Growth Report</Text>
    </View>
    <View style={styles.chartCard}>
    <View style={styles.chartLegend}>
        {legend.map((label, index) => (
          <View key={index} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: index === 0 ? COLORS.accent : index === 1 ? COLORS.secondary : COLORS.tertiary }
              ]} 
            />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  <LineChart
  data={monthlyData}
  width={monthlyData.labels.length * 80}  // dynamic width
  height={220}
  chartConfig={{
    backgroundColor: COLORS.white,
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: '0',
      strokeWidth: '0',
    },
  }}
  bezier
  style={styles.chart}
  fromZero
  yAxisLabel=""
  yAxisSuffix=""
  yAxisInterval={1}
  segments={5}
  withLegend={false}
/>

</ScrollView>

    </View>
  </View>);
  }
  function featureCardsInfo(){
    return( <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.featureCardsContainer}>
        {featureCards.map((card, index) => (
          <TouchableOpacity key={index} style={styles.featureCardWrapper}>
            <LinearGradient
              colors={card.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureCard}
            >
              <View style={styles.featureIconContainer}>
                <Icon name={card.icon} size={28} color={COLORS.white} />
              </View>
              <Text style={styles.featureTitle}>{card.title}</Text>
              <Text style={styles.featureDescription}>{card.description}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    
    backgroundColor: COLORS.white,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 15,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  section: {
    padding: 20,
    backgroundColor: COLORS.white,
    marginBottom: 15,
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    alignItems: 'center',
    width: '30%',
  },
  metricIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricTextContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  metricCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 5,
  },
  percentageText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 0,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  featureCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureCardWrapper: {
    width: '48%',
  },
  featureCard: {
    borderRadius: 12,
    padding: 15,
    height: 150,
    justifyContent: 'space-between',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
});

export default AdminHome;