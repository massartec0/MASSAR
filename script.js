// Intersection Observer for Reveal Animations
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));
    
    // Smooth Scroll links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            
            const target = document.querySelector(targetId);
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Portfolio Filter Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const workItems = document.querySelectorAll('.work-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            tabBtns.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            workItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    // Small delay to re-trigger reveal for filtered items if needed
                    setTimeout(() => item.classList.add('active'), 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
    
    console.log("Portfolio Filter & Ready!");
});

// --- Interactive Particle Background ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 60;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
    }

    draw() {
        ctx.fillStyle = 'rgba(70, 178, 211, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // Normal floating movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x > canvas.width || this.x < 0) this.vx *= -1;
        if (this.y > canvas.height || this.y < 0) this.vy *= -1;

        // Mouse interaction (Repel)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            this.x -= directionX * force * 5;
            this.y -= directionY * force * 5;
        }
    }
}

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
        
        // Connect particles
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < 150) {
                ctx.strokeStyle = `rgba(28, 127, 184, ${1 - (distance/150)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
animateParticles();
