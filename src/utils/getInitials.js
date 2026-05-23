// Get initials from full name
export const getInitials = (firstName = '', lastName = '') => {
    const first = firstName?.trim()?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.trim()?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}` || 'U';
};


export const getAvatarColor = (name = '') => {
    const colors = [
        '#D32F2F', // red
        '#C2185B', // deep pink
        '#E91E63', // pink
        '#1976D2', // blue
        '#1565C0', // deep blue
        '#0D47A1', // navy blue
        '#00796B', // teal dark
        '#00695C', // deep teal
        '#388E3C', // green
        '#2E7D32', // dark green
        '#F57C00', // orange
        '#EF6C00', // deep orange
        '#E65100', // burnt orange
        '#5D4037', // brown
        '#6D4C41', // coffee brown
        '#455A64', // blue grey
        '#37474F', // dark slate
        '#263238', // almost black blue
        '#0097A7', // cyan
        '#00838F', // deep cyan
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};