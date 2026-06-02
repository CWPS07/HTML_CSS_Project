    const words = [
      'Frontend Developer',
      'UI/UX Designer',
      'JavaScript Creator',
      'Creative Web Designer',
      'Typing Animation Expert'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const textElement = document.getElementById('text');

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex--);
      } else {
        textElement.textContent = currentWord.substring(0, charIndex++);
      }

      let speed = isDeleting ? 70 : 120;

      if (!isDeleting && charIndex === currentWord.length + 1) {
        speed = 1500;
        isDeleting = true;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500;
      }

      setTimeout(typeEffect, speed);
    }

    typeEffect();
