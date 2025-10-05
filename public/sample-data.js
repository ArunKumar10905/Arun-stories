// Sample data for testing
const sampleStories = [
    {
        id: '1',
        title: 'The Adventure Begins',
        content: 'In a land far away, there lived a brave knight named Arthur. He was known throughout the kingdom for his courage and kindness. One day, a mysterious message arrived that would change his life forever...',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'The Magic Forest',
        content: 'Deep in the heart of the enchanted woods, where sunlight barely touched the ground, magical creatures roamed freely. Elves, fairies, and talking animals lived in harmony, protected by ancient spells.',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'The Lost Treasure',
        content: 'Captain Jack had been searching for the legendary treasure of Pirates Bay for years. Many had tried and failed, but Jack was determined. With his trusty map and loyal crew, he set sail for one final attempt.',
        createdAt: new Date().toISOString()
    }
];

// Save to localStorage
localStorage.setItem('stories', JSON.stringify(sampleStories));

console.log('Sample stories added to localStorage');