import React from 'react';
import {
    Menu,
    Button,
    Text,
    Pressable,
    Center,
} from "native-base"
import {useTranslation} from 'react-i18next';

export default function () {
    const { t, i18n } = useTranslation(["errorScreen"]);
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)

    }
    const availableLanguages: any = {
        "en": "🇨🇦",
        "fr": "🇫🇷",
        "zh": "🇨🇳"
    }

    return (
        <Menu
            trigger={(triggerProps) => {
                return (
                    <Button
                        accessibilityLabel="More options menu" {...triggerProps}
                        leftIcon={<Text>{`${availableLanguages[i18n.language]} - ${i18n.language}`}</Text>}
                        variant="outline"
                    >

                    </Button>
                )
            }}
        >
            <Menu.Item onPress={() => changeLanguage('en')}>{`${availableLanguages['en']} - en`}</Menu.Item>
            <Menu.Item onPress={() => changeLanguage('fr')}>{`${availableLanguages['fr']} - fr`}</Menu.Item>
            <Menu.Item onPress={() => changeLanguage('zh')}>{`${availableLanguages['zh']} - zh`}</Menu.Item>
        </Menu>
    )
}
