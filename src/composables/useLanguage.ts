export function useLanguage(code: string) {
    const languages: Record<string, string> = {
        'ceb': 'Cebuano',
        'hil': 'Hiligaynon',
        'psp': 'Filipino Sign Langauge',
        'tl': 'Tagalog',
        'war': 'Waraywaray',
    }

    const expand = () => {
        return languages[code] ?? code
    }

    return {
        expand
    }
}