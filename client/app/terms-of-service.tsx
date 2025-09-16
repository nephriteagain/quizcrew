import { useAppTheme } from "@/providers/ThemeProvider";
import { ScrollView, StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";

const TERMS_OF_SERVICE_CONTENT = `# TERMS OF SERVICE

**Effective Date:** [INSERT DATE]

## 1. ACCEPTANCE OF TERMS

By accessing or using this application ("App"), you ("User") agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the App.

## 2. MODIFICATIONS TO TERMS

We reserve the right to modify, update, or change these Terms at any time, in our sole discretion, without prior notice. Any modifications will be effective immediately upon posting. Your continued use of the App following the posting of revised Terms constitutes your acceptance of such changes. **If you do not agree to any modifications, you must immediately cease all use of the App.**

## 3. DESCRIPTION OF SERVICE

The App provides [INSERT DESCRIPTION OF YOUR APP'S FUNCTIONALITY]. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.

## 4. USER ACCOUNTS AND REGISTRATION

4.1. You may be required to create an account to access certain features of the App.

4.2. You are responsible for maintaining the confidentiality of your account credentials.

4.3. You agree to provide accurate, current, and complete information during registration.

4.4. You are solely responsible for all activities that occur under your account.

## 5. ACCEPTABLE USE

5.1. You agree not to use the App for any unlawful purpose or in violation of these Terms.

5.2. You shall not:
- Violate any applicable laws or regulations
- Infringe upon the rights of others
- Transmit harmful, threatening, abusive, or defamatory content
- Attempt to gain unauthorized access to the App or its systems
- Use the App to distribute spam, malware, or other harmful content

## 6. INTELLECTUAL PROPERTY

6.1. The App and all content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws.

6.2. You are granted a limited, non-exclusive, non-transferable license to use the App in accordance with these Terms.

## 7. DISCLAIMERS

7.1. THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

7.2. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

7.3. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.

## 8. LIMITATION OF LIABILITY

TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE APP.

## 9. TERMINATION

9.1. We may terminate or suspend your access to the App at any time, with or without cause, with or without notice.

9.2. You may terminate your use of the App at any time by ceasing to access the App.

9.3. Upon termination, all rights and licenses granted to you will immediately cease.

## 10. GOVERNING LAW

These Terms shall be governed by and construed in accordance with the laws of [INSERT JURISDICTION], without regard to its conflict of law principles.

## 11. CONTACT INFORMATION

If you have any questions about these Terms, please contact us at [INSERT CONTACT EMAIL].

---

**BY USING THIS APP, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.**
`;

export default function TermsOfServiceScreen() {
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
                    {TERMS_OF_SERVICE_CONTENT}
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