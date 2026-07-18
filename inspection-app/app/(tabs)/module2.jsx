import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSurveys } from '@/context/SurveyContext';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export default function Module2Screen() {
  const { addSurvey } = useSurveys();

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!siteName.trim()) newErrors.siteName = 'Site Name is required';
    if (!clientName.trim()) newErrors.clientName = 'Client Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!priority) newErrors.priority = 'Priority is required';
    if (!date.trim()) {
      newErrors.date = 'Date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      newErrors.date = 'Date must be in YYYY-MM-DD format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const newSurvey = addSurvey({
        siteName: siteName.trim(),
        clientName: clientName.trim(),
        description: description.trim(),
        priority,
        date: date.trim(),
        location: siteName.trim(),
      });

      Alert.alert(
        'Survey Created',
        `Survey ${newSurvey.id} created successfully!\n\nSite: ${siteName}\nClient: ${clientName}\nPriority: ${priority}\nDate: ${date}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSiteName('');
              setClientName('');
              setDescription('');
              setPriority('');
              setDate('');
              setErrors({});
            },
          },
        ]
      );
    }
  };

  const renderError = (field) => {
    if (errors[field]) {
      return <Text style={styles.errorText}>{errors[field]}</Text>;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Survey</Text>
        <Text style={styles.headerSubtitle}>Module 2</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Survey Form</Text>
          <Text style={styles.cardDescription}>
            Fill in the details below to create a new field survey.
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Site Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.siteName && styles.inputError]}
            placeholder="Enter site name"
            value={siteName}
            onChangeText={(text) => {
              setSiteName(text);
              if (errors.siteName) setErrors({ ...errors, siteName: '' });
            }}
            placeholderTextColor="#999"
          />
          {renderError('siteName')}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Client Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.clientName && styles.inputError]}
            placeholder="Enter client name"
            value={clientName}
            onChangeText={(text) => {
              setClientName(text);
              if (errors.clientName) setErrors({ ...errors, clientName: '' });
            }}
            placeholderTextColor="#999"
          />
          {renderError('clientName')}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            placeholder="Enter survey description"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
          {renderError('description')}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Priority <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.priorityRow}>
            {PRIORITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.priorityBtn,
                  priority === option && styles.priorityBtnActive,
                  priority === option && getPriorityStyle(option),
                ]}
                onPress={() => {
                  setPriority(option);
                  if (errors.priority) setErrors({ ...errors, priority: '' });
                }}
              >
                <Text
                  style={[
                    styles.priorityBtnText,
                    priority === option && styles.priorityBtnTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {renderError('priority')}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Date <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.date && styles.inputError]}
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={(text) => {
              setDate(text);
              if (errors.date) setErrors({ ...errors, date: '' });
            }}
            keyboardType="numbers-and-punctuation"
            placeholderTextColor="#999"
          />
          {renderError('date')}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Create Survey</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => {
            setSiteName('');
            setClientName('');
            setDescription('');
            setPriority('');
            setDate('');
            setErrors({});
          }}
        >
          <Text style={styles.resetBtnText}>Reset Form</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function getPriorityStyle(priority) {
  switch (priority) {
    case 'Low':
      return { backgroundColor: '#28a745' };
    case 'Medium':
      return { backgroundColor: '#ffc107' };
    case 'High':
      return { backgroundColor: '#fd7e14' };
    case 'Critical':
      return { backgroundColor: '#dc3545' };
    default:
      return {};
  }
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
  headerSubtitle: {
    fontSize: 13,
    color: '#007bff',
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
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  required: {
    color: '#dc3545',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  textArea: {
    height: 100,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: '#fafafa',
  },
  priorityBtnActive: {
    borderWidth: 2,
  },
  priorityBtnText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  priorityBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetBtn: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  resetBtnText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});
