import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Sections = [
  {
    header: 'Preferences',
    items: [
      { id: 'language', icon: 'globe', label: 'Language', type: 'select' },
      { id: 'theme', icon: 'moon', label: 'Theme', type: 'select' },
      { id: 'notifications', icon: 'notifications', label: 'Notifications', type: 'toggle' },
      { id: 'about', icon: 'information-circle', label: 'About', type: 'link' },
    ],
  },
  {
    header: 'Help & Support',
    items: [
      { id: 'contact', icon: 'mail', label: 'Contact Us', type: 'link' },
      { id: 'faq', icon: 'help-circle', label: 'FAQ', type: 'link' },
      { id: 'terms', icon: 'document', label: 'Terms & Conditions', type: 'link' },
      { id: 'privacy', icon: 'lock-closed', label: 'Privacy Policy', type: 'link' },
    ],
  },
  {
    header: 'Account',
    items: [
      { id: 'profile', icon: 'person', label: 'Profile', type: 'link' },
      { id: 'password', icon: 'lock-closed', label: 'Change Password', type: 'link' },
      { id: 'delete', icon: 'trash', label: 'Delete Account', type: 'link' },
    ],
  },
  {
    header: 'Social',
    items: [
      { id: 'facebook', icon: 'logo-facebook', label: 'Facebook', type: 'link' },
      { id: 'twitter', icon: 'logo-twitter', label: 'Twitter', type: 'link' },
      { id: 'instagram', icon: 'logo-instagram', label: 'Instagram', type: 'link' },
    ],
  },
];

const ProfileSettings: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false} // Optional: Hide the scroll indicator
      >
        <View style={styles.header}>
          <Text style={styles.title}>Tohirgoo</Text>
          <Text style={styles.subtitle}>Update your settings here</Text>
        </View>
        {Sections.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{header}</Text>
            </View>
            {items.map(({ label, id, icon }, index) => (
              <View
                key={id} // Ensure unique key for each item
                style={[
                  styles.rowWrapper,
                  index === 0 && { borderTopWidth: 0 }, // Remove top border for first item
                ]}
              >
                <TouchableOpacity onPress={() => console.log(label)}>
                  <View style={styles.row}>
                    <Ionicons name={icon as any} color={'#616161'} size={24} />
                    <Text style={styles.rowlabel}>{label}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d1d1d',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#929292',
  },
  section: {
    paddingTop: 12,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a7a7a7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  rowWrapper: {
    paddingLeft: 24,
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
    backgroundColor: '#fff',
  },
  row: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 24,
  },
  rowlabel: {
    fontSize: 16,
    color: '#1d1d1d',
  },
});

export default ProfileSettings;
