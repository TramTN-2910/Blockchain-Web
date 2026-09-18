'use client';

import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  isBlock: boolean; // 20% square/hexagon blocks
  color: string; // purple or cyan
  pulseOffset: number;
}

interface Packet {
  fromNode: number;
  toNode: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
}

export default function BlockchainBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 150,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Node count: 70 on desktop, 35 on mobile
    let nodes: Node[] = [];
    let packets: Packet[] = [];

    const purpleColor = '#8B5CF6';
    const cyanColor = '#06B6D4';

    const initNodes = () => {
      const isMobile = width < 768;
      const nodeCount = isMobile ? 35 : 70;
      nodes = [];
      packets = [];

      for (let i = 0; i < nodeCount; i++) {
        const isBlock = Math.random() < 0.2; // 20% blocks
        const color = Math.random() < 0.5 ? purpleColor : cyanColor;
        const radius = isBlock
          ? Math.random() * 2 + 5 // 5px - 7px
          : Math.random() * 1.5 + 1.5; // 1.5px - 3px

        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6, // 0.3 - 0.7 px/frame
          vy: (Math.random() - 0.5) * 0.6,
          baseRadius: radius,
          radius: radius,
          isBlock,
          color,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    initNodes();

    let lastPacketTime = Date.now();

    // Render loop
    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const isDark =
        document.documentElement.classList.contains('dark') || theme === 'dark';
      const maxDistance = 120;

      // 1. Update and draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Dynamic Opacity: closer = clearer (0.15 - 0.40)
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.35 : 0.22);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            // Create gradient line between purple and cyan
            const grad = ctx.createLinearGradient(
              nodes[i].x,
              nodes[i].y,
              nodes[j].x,
              nodes[j].y
            );
            grad.addColorStop(0, nodes[i].color);
            grad.addColorStop(1, nodes[j].color);

            ctx.strokeStyle = grad;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Spawn occasional data pulse
            if (
              Math.random() < 0.0008 &&
              packets.length < 8 &&
              Date.now() - lastPacketTime > 600
            ) {
              packets.push({
                fromNode: i,
                toNode: j,
                progress: 0,
                speed: Math.random() * 0.02 + 0.015,
                color: Math.random() < 0.5 ? '#A78BFA' : '#67E8F9',
              });
              lastPacketTime = Date.now();
            }
          }
        }

        // Mouse proximity connection
        if (mouse.active) {
          const mdx = nodes[i].x - mouse.x;
          const mdy = nodes[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            const mAlpha = (1 - mdist / mouse.radius) * (isDark ? 0.45 : 0.3);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = nodes[i].color;
            ctx.globalAlpha = mAlpha;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Gentle attraction
            const force = (1 - mdist / mouse.radius) * 0.15;
            nodes[i].x -= (mdx / mdist) * force;
            nodes[i].y -= (mdy / mdist) * force;
          }
        }
      }

      // 2. Update and draw moving Data Packets (Photon Pulses)
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        const from = nodes[pkt.fromNode];
        const to = nodes[pkt.toNode];

        if (!from || !to || pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const px = from.x + (to.x - from.x) * pkt.progress;
        const py = from.y + (to.y - from.y) * pkt.progress;

        // Draw glowing packet head
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 3. Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce at edges smoothly
        if (node.x <= 0 || node.x >= width) node.vx *= -1;
        if (node.y <= 0 || node.y >= height) node.vy *= -1;

        // Pulsing glow effect
        const pulse = Math.sin(time * 2 + node.pulseOffset) * 0.5 + 0.5; // 0 to 1
        const currentOpacity = isDark
          ? 0.25 + pulse * 0.35 // 0.25 to 0.60
          : 0.2 + pulse * 0.25;

        if (node.isBlock) {
          // Draw 20% Block / Hexagon / Square
          const size = node.baseRadius * (1 + pulse * 0.2);
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.rotate(time * 0.5 + node.pulseOffset);

          ctx.fillStyle = node.color;
          ctx.globalAlpha = currentOpacity;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = pulse * 10;

          // Draw rounded mini-square
          ctx.fillRect(-size / 2, -size / 2, size, size);

          // Center bright core
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = currentOpacity * 0.7;
          ctx.fillRect(-size / 4, -size / 4, size / 2, size / 2);

          ctx.restore();
          ctx.globalAlpha = 1.0;
        } else {
          // Draw 80% Circle Node
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = currentOpacity;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = pulse * 6;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
    >
      {/* Glow depth-of-field lights (Purple top-right, Cyan bottom-left) */}
      <div className="absolute -top-40 -right-40 w-96 sm:w-[520px] h-96 sm:h-[520px] rounded-full bg-purple-600/15 dark:bg-purple-600/20 blur-[130px]" />
      <div className="absolute -bottom-40 -left-40 w-96 sm:w-[520px] h-96 sm:h-[520px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/18 blur-[130px]" />

      {/* HTML5 60FPS Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
