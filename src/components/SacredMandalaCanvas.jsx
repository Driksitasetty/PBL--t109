import React, { useEffect, useRef } from 'react';

// Animated Sacred Vedic Canvas (Vibrant Rotating Sudarshan / Sacred Vedic Chakra + Glowing Diya Embers)
export default function SacredMandalaCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle embers (diya flames / sacred temple sparks) - increased count and brightness
    const particleCount = 75;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.8 + 1.2,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.9 - 0.3, // float upwards like temple incense & diya embers
      alpha: Math.random() * 0.5 + 0.4,
      pulse: Math.random() * 0.03 + 0.015,
      color: Math.random() > 0.45 ? 'rgba(255, 195, 60,' : 'rgba(255, 120, 20,'
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep spiritual ambient background glow
      const radialGradient = ctx.createRadialGradient(
        width / 2, height * 0.32, 60,
        width / 2, height * 0.32, Math.max(width, height) * 0.85
      );
      radialGradient.addColorStop(0, 'rgba(85, 18, 30, 0.65)');
      radialGradient.addColorStop(0.4, 'rgba(32, 8, 14, 0.88)');
      radialGradient.addColorStop(1, 'rgba(12, 4, 6, 0.98)');
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Main Sacred Rotating Vedic Chakra (Sudarshan / Sri Yantra Geometry)
      ctx.save();
      const chakraX = width / 2;
      const chakraY = height * 0.32;
      ctx.translate(chakraX, chakraY);
      angle += 0.0025; // Gentle rotation speed
      ctx.rotate(angle);

      // Glowing center sun / bindu
      ctx.shadowColor = 'rgba(255, 180, 0, 0.7)';
      ctx.shadowBlur = 25;
      ctx.fillStyle = 'rgba(255, 190, 40, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.fill();

      // Outer Chakra Rim
      ctx.strokeStyle = 'rgba(235, 185, 60, 0.32)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 260, 0, Math.PI * 2);
      ctx.stroke();

      // Second Decorative Ring with Dash pattern
      ctx.strokeStyle = 'rgba(255, 140, 20, 0.28)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 235, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner Ring
      ctx.strokeStyle = 'rgba(235, 185, 60, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 160, 0, Math.PI * 2);
      ctx.stroke();

      // Innermost Sacred Ring
      ctx.strokeStyle = 'rgba(255, 190, 50, 0.45)';
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.stroke();

      // 16 Radiating Sacred Chakra Spokes / Petals
      const spokes = 16;
      for (let i = 0; i < spokes; i++) {
        const spokeAngle = (i * 2 * Math.PI) / spokes;
        ctx.save();
        ctx.rotate(spokeAngle);

        // Radiating golden spoke lines
        ctx.strokeStyle = 'rgba(255, 200, 70, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 45);
        ctx.lineTo(0, 255);
        ctx.stroke();

        // Decorative Diamond / Arrowhead tip on outer ring
        ctx.fillStyle = 'rgba(255, 180, 40, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, 265);
        ctx.lineTo(6, 250);
        ctx.lineTo(0, 242);
        ctx.lineTo(-6, 250);
        ctx.closePath();
        ctx.fill();

        // 16 Petal Lotus Geometry Curves
        ctx.strokeStyle = 'rgba(255, 120, 30, 0.22)';
        ctx.beginPath();
        ctx.ellipse(0, 140, 26, 65, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // Counter-rotating inner 8-pointed Vedic star
      ctx.save();
      ctx.rotate(-angle * 2.5);
      ctx.strokeStyle = 'rgba(255, 215, 80, 0.35)';
      ctx.lineWidth = 1.5;
      for (let j = 0; j < 8; j++) {
        const a = (j * Math.PI) / 4;
        ctx.strokeRect(-50, -50, 100, 100);
        ctx.rotate(a);
      }
      ctx.restore();

      ctx.restore(); // Restore center transform

      // Draw and update glowing embers / temple diya particles (Bright & Mesmerizing)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(angle * 8 + p.x) * 0.015;

        // Wrap around screen boundaries smoothly
        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Draw particle with glowing halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const currentAlpha = Math.max(0.2, Math.min(0.9, p.alpha));
        ctx.fillStyle = `${p.color} ${currentAlpha})`;
        ctx.shadowColor = 'rgba(255, 160, 20, 0.9)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
