import { useAppTheme } from "@/providers/ThemeProvider";
import { ScrollView, StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";

const PRIVACY_POLICY_CONTENT = `# PRIVACY POLICY

**Effective Date:** [INSERT DATE]

## 1. INTRODUCTION

This Privacy Policy explains how [INSERT APP NAME] ("we," "our," or "us") collects, uses, processes, and protects your personal information in accordance with Republic Act No. 10173, also known as the Data Privacy Act of 2012 ("DPA"), and other applicable laws.

By using our application, you consent to the collection and processing of your personal information as described in this Privacy Policy.

## 2. DATA CONTROLLER INFORMATION

**Personal Information Controller:** [INSERT COMPANY NAME]
**Address:** [INSERT COMPLETE ADDRESS]
**Contact Details:** [INSERT EMAIL AND PHONE]
**Data Protection Officer:** [INSERT DPO NAME AND CONTACT]

## 3. PERSONAL INFORMATION WE COLLECT

### 3.1 Personal Information
We may collect the following personal information:
- Name and contact information (email address, phone number)
- Account credentials and authentication information
- Profile information and preferences
- Device information and identifiers
- Usage data and analytics
- Location information (if enabled)
- Communication records and correspondence

### 3.2 Sensitive Personal Information
We may collect sensitive personal information only with your explicit consent or when legally permitted, including:
- Biometric data (if applicable)
- Health information (if applicable to app functionality)
- Financial information for payment processing
- Government-issued identification numbers (when required)

## 4. PURPOSES OF PROCESSING

We process your personal information for the following specific and legitimate purposes:

### 4.1 Primary Purposes
- To provide and maintain our application services
- To create and manage your user account
- To process transactions and payments
- To communicate with you about our services
- To provide customer support and assistance
- To improve our application and user experience

## 5. DATA SUBJECT RIGHTS

Under the Data Privacy Act of 2012, you have the following rights:

### 5.1 Right to Information
- To be informed about the processing of your personal information
- To receive information about purposes, scope, and methods of processing
- To know the recipients of your data and retention periods

### 5.2 Right to Access
You may request reasonable access to:
- Contents of your processed personal information
- Sources from which information was obtained
- Names and addresses of recipients
- Manner of processing and automated processes

### 5.3 Right to Rectification
- To dispute inaccurate or erroneous personal information
- To have incorrect data corrected immediately

### 5.4 Right to Erasure/Blocking
- To request removal or destruction when data is incomplete, outdated, false, or unlawfully obtained
- To stop processing for unauthorized purposes

## 6. CONTACT INFORMATION

**For privacy-related inquiries:**
- **Data Protection Officer:** [INSERT DPO NAME]
- **Email:** [INSERT PRIVACY EMAIL]
- **Phone:** [INSERT PHONE NUMBER]
- **Address:** [INSERT COMPLETE ADDRESS]

**For complaints or concerns:**
You may also file complaints with the National Privacy Commission:
- **Website:** https://privacy.gov.ph
- **Email:** info@privacy.gov.ph
- **Phone:** +63 2 8234-2228

---

**By using our application, you acknowledge that you have read, understood, and agree to this Privacy Policy and the processing of your personal information as described herein.**

**Last Updated:** [INSERT DATE]
`;

export default function PrivacyPolicyScreen() {
    const theme = useAppTheme();
    const styles = makeStyles(theme);

    const markdownStyles = {
        body: {
            color: theme.colors.onSurface,
            fontSize: 16,
            lineHeight: 24,
        },
        heading1: {
            color: theme.colors.onSurface,
            fontSize: 24,
            fontWeight: "bold" as const,
            marginBottom: 16,
            marginTop: 20,
        },
        heading2: {
            color: theme.colors.onSurface,
            fontSize: 20,
            fontWeight: "bold" as const,
            marginBottom: 12,
            marginTop: 16,
        },
        heading3: {
            color: theme.colors.onSurface,
            fontSize: 18,
            fontWeight: "600" as const,
            marginBottom: 8,
            marginTop: 12,
        },
        paragraph: {
            color: theme.colors.onSurface,
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 12,
        },
        listItem: {
            color: theme.colors.onSurface,
            fontSize: 16,
            lineHeight: 22,
        },
        link: {
            color: theme.colors.primary,
            textDecorationLine: "underline" as const,
        },
        strong: {
            fontWeight: "bold" as const,
            color: theme.colors.onSurface,
        },
        em: {
            fontStyle: "italic" as const,
            color: theme.colors.onSurface,
        },
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Markdown style={markdownStyles}>
                    {PRIVACY_POLICY_CONTENT}
                </Markdown>
            </ScrollView>
        </View>
    );
}

const makeStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.surface,
        },
        scrollView: {
            flex: 1,
        },
        contentContainer: {
            padding: 20,
            paddingBottom: 40,
        },
    });