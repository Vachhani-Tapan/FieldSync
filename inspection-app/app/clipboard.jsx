import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

export default function ClipboardScreen() {
  const [pasteContent, setPasteContent] = useState('');
  const [clipboardHistory, setClipboardHistory] = useState([]);

  const copyToClipboard = async (label, text) => {
    try {
      await Clipboard.setStringAsync(text);
      setClipboardHistory((prev) => [{ label, text, time: new Date() }, ...prev].slice(0, 10));
      Alert.alert('Copied!', `${label} copied to clipboard.`);
    } catch {
      Alert.alert('Error', 'Failed to copy to clipboard.');
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setPasteContent(text);
      } else {
        Alert.alert('Empty', 'Clipboard is empty.');
      }
    } catch {
      Alert.alert('Error', 'Failed to read clipboard.');
    }
  };

  const clearClipboard = async () => {
    try {
      await Clipboard.setStringAsync('');
      setPasteContent('');
      Alert.alert('Cleared', 'Clipboard data has been cleared.');
    } catch {
      Alert.alert('Error', 'Failed to clear clipboard.');
    }
  };

  const copySurveyId = () => {
    const surveyId = `SRV-${Date.now().toString(36).toUpperCase()}`;
    copyToClipboard('Survey ID', surveyId);
  };

  const surveyIds = [
    { id: 'SRV-A1B2C3', label: 'Alpha Site Survey' },
    { id: 'SRV-D4E5F6', label: 'Beta Location Survey' },
    { id: 'SRV-G7H8I9', label: 'Gamma Field Survey' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Copy</Text>
          <Text style={styles.cardDescription}>
            Tap any button below to copy the respective data to your clipboard.
          </Text>
        </View>

        <Text style={styles.sectionHeader}>Copy Survey ID</Text>
        <View style={styles.btnGroup}>
          {surveyIds.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.actionBtn}
              onPress={() => copyToClipboard(s.label, s.id)}
            >
              <Text style={styles.actionBtnText}>{s.id}</Text>
              <Text style={styles.actionBtnSub}>{s.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={copySurveyId}>
            <Text style={[styles.actionBtnText, styles.primaryText]}>Generate New Survey ID</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Copy Contact Number</Text>
        <View style={styles.btnGroup}>
          {['+1 (555) 123-4567', '+1 (555) 987-6543', '+1 (555) 456-7890'].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.contactBtn}
              onPress={() => copyToClipboard('Contact', num)}
            >
              <Text style={styles.contactBtnText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Copy Current Location</Text>
        <TouchableOpacity
          style={[styles.actionBtn, styles.primaryBtn]}
          onPress={() => copyToClipboard('Location', '28.6139° N, 77.2090° E')}
        >
          <Text style={[styles.actionBtnText, styles.primaryText]}>Copy Default Location</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Paste Notes</Text>
        <View style={styles.pasteArea}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Pasted content will appear here..."
            value={pasteContent}
            onChangeText={setPasteContent}
          />
          <TouchableOpacity style={styles.pasteBtn} onPress={pasteFromClipboard}>
            <Text style={styles.pasteBtnText}>Paste from Clipboard</Text>
          </TouchableOpacity>
          {pasteContent ? (
            <TouchableOpacity style={styles.clearBtn} onPress={clearClipboard}>
              <Text style={styles.clearBtnText}>Clear Clipboard Data</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {clipboardHistory.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>History</Text>
            {clipboardHistory.map((entry, i) => (
              <View key={i} style={styles.historyItem}>
                <Text style={styles.historyLabel}>{entry.label}</Text>
                <Text style={styles.historyText} numberOfLines={1}>
                  {entry.text}
                </Text>
              </View>
            ))}
          </View>
        )}
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
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
    color: '#333',
  },
  btnGroup: {
    marginBottom: 12,
  },
  actionBtn: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  actionBtnSub: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  primaryBtn: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  primaryText: {
    color: '#fff',
  },
  contactBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 6,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  contactBtnText: {
    fontSize: 15,
    color: '#333',
  },
  pasteArea: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 8,
  },
  pasteBtn: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  pasteBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  clearBtn: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  clearBtnText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '600',
  },
  historyItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    marginBottom: 6,
  },
  historyLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
  },
  historyText: {
    fontSize: 13,
    color: '#333',
  },
});
