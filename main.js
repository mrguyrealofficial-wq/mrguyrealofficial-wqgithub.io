// Three.js animated background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create geometric shapes
const geometry = new THREE.IcosahedronGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({
    color: 0x00D9FF,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});

const shapes = [];
for (let i = 0; i < 15; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 20;
    mesh.position.y = (Math.random() - 0.5) * 20;
    mesh.position.z = (Math.random() - 0.5) * 20;
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    scene.add(mesh);
    shapes.push(mesh);
}

camera.position.z = 10;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    shapes.forEach((shape, index) => {
        shape.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
        shape.rotation.y += 0.001 * (index % 3 === 0 ? 1 : -1);
    });
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    smokeCanvas.width = window.innerWidth;
    smokeCanvas.height = window.innerHeight;
});

// Smoke Effect (Grok-style cinematic)
const smokeCanvas = document.getElementById('smoke-canvas');
const smokeCtx = smokeCanvas.getContext('2d');
smokeCanvas.width = window.innerWidth;
smokeCanvas.height = window.innerHeight;

class SmokeParticle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * smokeCanvas.width;
        this.y = smokeCanvas.height + 200;
        this.size = Math.random() * 250 + 150;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.12 + 0.04;
        this.life = 0;
        this.maxLife = Math.random() * 600 + 400;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    }
    
    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.life++;
        
        // Smooth fade in and out
        if (this.life < this.maxLife * 0.2) {
            this.opacity = (this.life / (this.maxLife * 0.2)) * this.maxOpacity;
        } else if (this.life > this.maxLife * 0.7) {
            this.opacity = ((this.maxLife - this.life) / (this.maxLife * 0.3)) * this.maxOpacity;
        } else {
            this.opacity = this.maxOpacity;
        }
        
        if (this.life >= this.maxLife || this.y < -this.size) {
            this.reset();
        }
    }
    
    draw() {
        smokeCtx.save();
        smokeCtx.translate(this.x, this.y);
        smokeCtx.rotate(this.rotation);
        smokeCtx.globalAlpha = Math.max(0, this.opacity);
        
        // Create radial gradient for soft smoke effect
        const gradient = smokeCtx.createRadialGradient(0, 0, 0, 0, 0, this.size / 2);
        gradient.addColorStop(0, `rgba(0, 217, 255, ${this.opacity * 0.8})`);
        gradient.addColorStop(0.4, `rgba(0, 180, 220, ${this.opacity * 0.4})`);
        gradient.addColorStop(0.7, `rgba(0, 120, 180, ${this.opacity * 0.2})`);
        gradient.addColorStop(1, 'rgba(0, 80, 150, 0)');
        
        smokeCtx.fillStyle = gradient;
        smokeCtx.filter = 'blur(60px)';
        smokeCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        
        smokeCtx.restore();
    }
}

// Create more smoke particles for cinematic effect
const smokeParticles = [];
for (let i = 0; i < 30; i++) {
    const particle = new SmokeParticle();
    particle.life = Math.random() * particle.maxLife; // Stagger start times
    smokeParticles.push(particle);
}

function animateSmoke() {
    smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
    
    smokeParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateSmoke);
}
animateSmoke();

// GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Animate channel cards on scroll
gsap.utils.toArray('.channel-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.1
    });
});

// Counter animation for stats
const counters = document.querySelectorAll('.stat-number');
counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    gsap.to(counter, {
        scrollTrigger: {
            trigger: counter,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: 'power1.out'
    });
});

// Logo glitch effect on hover
const logo = document.querySelector('.logo');
logo.addEventListener('mouseenter', () => {
    gsap.to(logo, {
        x: () => Math.random() * 10 - 5,
        y: () => Math.random() * 10 - 5,
        duration: 0.05,
        repeat: 10,
        yoyo: true,
        onComplete: () => {
            gsap.set(logo, { x: 0, y: 0 });
        }
    });
});

// Smooth scroll for navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        // Check if it's an external link
        if (href.includes('.html')) {
            window.location.href = href;
        } else {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Discord API for home page status
const DISCORD_API = 'https://discord.com/api/guilds/1428566736109572302/widget.json';

async function fetchServerStatus() {
    try {
        const response = await fetch(DISCORD_API);
        
        if (!response.ok) {
            throw new Error('Failed to fetch server data');
        }
        
        const data = await response.json();
        
        // Update Discord Status
        document.getElementById('discord-status').textContent = 'ONLINE';
        
        // Count active members
        const activeMembers = data.members ? data.members.length : 0;
        document.getElementById('active-members').textContent = activeMembers;
        
        // Total members
        const totalMembers = data.presence_count || 0;
        document.getElementById('total-members').textContent = totalMembers;
        
        // Voice activity
        const voiceChannels = data.channels ? data.channels.filter(ch => ch.type === 2) : [];
        let voiceActivity = 0;
        data.members?.forEach(member => {
            if (member.channel_id && voiceChannels.some(ch => ch.id === member.channel_id)) {
                voiceActivity++;
            }
        });
        document.getElementById('voice-activity').textContent = voiceActivity;
        
        // Update indicators
        const indicators = document.querySelectorAll('.status-indicator');
        indicators.forEach(indicator => {
            indicator.classList.add('online');
        });
        
    } catch (error) {
        console.error('Error fetching Discord data:', error);
        
        document.getElementById('discord-status').textContent = 'OFFLINE';
        document.getElementById('active-members').textContent = '--';
        document.getElementById('total-members').textContent = '--';
        document.getElementById('voice-activity').textContent = '--';
    }
    
    // Update last check time
    const lastCheckElement = document.getElementById('last-check');
    if (lastCheckElement) {
        const now = new Date();
        lastCheckElement.textContent = now.toLocaleTimeString();
    }
}

// Fetch immediately
fetchServerStatus();

// Update every 30 seconds
setInterval(fetchServerStatus, 30000);