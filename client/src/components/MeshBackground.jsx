import { useEffect, useRef } from 'react';

/**
 * Hybrid Futuristic AI Portal Background.
 * Renders radial gradient atmosphere, CSS dot-grid, and canvas connecting particle links.
 */
export default function MeshBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrame;
    let nodes = [];

    const NODE_COUNT = 60;
    const MAX_DISTANCE = 150;
    const NODE_SPEED = 0.2;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * NODE_SPEED,
        vy: (Math.random() - 0.5) * NODE_SPEED,
        radius: Math.random() * 1.2 + 0.6,
      }));
    }

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render & update coordinates
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      // Draw connection vectors
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const alpha = (1 - dist / MAX_DISTANCE) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw vector nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.35)';
        ctx.fill();
      }

      animFrame = requestAnimationFrame(drawFrame);
    }

    resize();
    initNodes();
    drawFrame();

    const handleResize = () => {
      resize();
      initNodes();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#07070a]">
      {/* CSS Dot Grid Overlay */}
      <div className="absolute inset-0 grid-overlay" />
      
      {/* Animated Canvas Vectors */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Glowing Ambient Atmosphere Orbs */}
      <div className="orb-glow orb-blue" />
      <div className="orb-glow orb-purple" />
    </div>
  );
}
