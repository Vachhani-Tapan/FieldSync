import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Module1Screen() {
  const studentDetails = {
    name: 'Tapan Vachhani',
    studentId: '002',
    department: 'Field Inspection',
    session: '2025-2026',
  };

  const [surveyStats] = useState({ total: 12, completed: 8, pending: 3, flagged: 1, });

  const [recentSurveys] = useState([
    { id: 'SRV-1042', siteName: 'Sector 5 Complex', location: 'Kolkata', status: 'Completed' },
    { id: 'SRV-1043', siteName: 'Lake View Block B', location: 'Salt Lake', status: 'In Progress' },
    { id: 'SRV-1044', siteName: 'Highway 12 Overpass', location: 'Rajarhat', status: 'Flagged' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Field Survey</Text>
        <Text style={styles.headerStatus}>GPS: Active</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome, {studentDetails.name}</Text>
          <Text style={styles.text}>Student ID: {studentDetails.studentId}</Text>
          <Text style={styles.text}>Department: {studentDetails.department}</Text>
          <Text style={styles.text}>Session: {studentDetails.session}</Text>
        </View>

        <Text style={styles.sectionHeader}>Today's Survey Count</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{surveyStats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{surveyStats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{surveyStats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{surveyStats.flagged}</Text>
            <Text style={styles.statLabel}>Flagged</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Action', 'New Survey')}>
            <Text style={styles.actionBtnText}>+ New Survey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Action', 'View Location')}>
            <Text style={styles.actionBtnText}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Action', 'Contacts')}>
            <Text style={styles.actionBtnText}>Contacts</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Recent Survey Summary</Text>
        {recentSurveys.map((item) => (
          <View key={item.id} style={styles.surveyItem}>
            <Text style={styles.surveyTitle}>{item.id} - {item.siteName}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
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
  header: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStatus: {
    fontSize: 13,
    color: 'green',
    fontWeight: '600',
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
  surveyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
