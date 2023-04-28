const kebabize = (str: string) => str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()
);

export const makeStyle = (style: Partial<CSSStyleDeclaration>): string => {
    return Object.entries(style).map(([k, v]) => {
        if (v) {
            return `${kebabize(k)}:${v};`;
        }
        return '';
    }
    ).join(' ');
}
