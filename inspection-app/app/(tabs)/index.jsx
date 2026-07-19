import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSurveys } from '@/context/SurveyContext';

export default function Module1Screen() {
  const router = useRouter();
  const { surveys, stats } = useSurveys();

  const studentDetails = {
    name: 'Tapan Vachhani',
    studentId: '002',
    department: 'Field Inspection',
    session: '2025-2026',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome, {studentDetails.name}</Text>
          <Text style={styles.text}>Student ID: {studentDetails.studentId}</Text>
          <Text style={styles.text}>Department: {studentDetails.department}</Text>
          <Text style={styles.text}>Session: {studentDetails.session}</Text>
        </View>

        <Text style={styles.sectionHeader}>Today&apos;s Survey Count</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.flagged}</Text>
            <Text style={styles.statLabel}>Flagged</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.navigate('/(tabs)/module2')}>
            <Text style={styles.actionBtnText}>+ New Survey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.navigate('/(tabs)/module3')}>
            <Text style={styles.actionBtnText}>📷 Site Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.navigate('/location')}>
            <Text style={styles.actionBtnText}>📍 Location</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Recent Survey Summary</Text>
        {surveys.slice(0, 5).map((item) => (
          <View key={item.id} style={[styles.surveyItem, item.status === 'Flagged' && styles.flaggedItem]}>
            <Text style={styles.surveyTitle}>{item.id} - {item.siteName}</Text>
            <Text style={styles.text}>Client: {item.clientName}</Text>
            <Text style={styles.text}>Priority: {item.priority}</Text>
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={[styles.text, styles.statusText]}>Status: {item.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  surveyItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
  },
  flaggedItem: {
    borderColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },
  surveyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    fontWeight: '600',
    marginTop: 2,
  },
});
