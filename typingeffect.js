document.addEventListener('DOMContentLoaded', () => {
    const sentences = [
        'Hi, I\'m Cth4n.',
        'A ROBLOX Full Stack Developer'
    ];

    let currentSentence = 0;
    let currentChar = 0;
    let isDeleting = false;
    const typingSpeed = 150; // Milliseconds per character
    const deleteSpeed = 100; // Milliseconds per character
    const pauseTime = 2000; // Pause time at end of sentence
    const textElement = document.getElementById('typing-text');

    function type() {
        const fullSentence = sentences[currentSentence];
        if (isDeleting) {
            currentChar--;
        } else {
            currentChar++;
        }

        textElement.textContent = fullSentence.substring(0, currentChar);

        if (!isDeleting && currentChar === fullSentence.length) {
            setTimeout(() => isDeleting = true, pauseTime);
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentSentence = (currentSentence + 1) % sentences.length;
        }

        const delay = isDeleting ? deleteSpeed : typingSpeed;
        setTimeout(type, delay);
    }

    // Initialize cursor
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    textElement.appendChild(cursor);

    type(); // Start the typing effect
});