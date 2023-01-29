<script lang="ts">
  import { onMount } from "svelte";

  export let stage: "1" | "2" | "3";

  type Particle = { x: number; y: number; r: number; vx?: number; vy?: number };
  let canvas: HTMLCanvasElement;

  onMount(() => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.addEventListener("pointerdown", createParticleAtpointer);

    /** Animations */
    let frameId = 0;
    let lastFrame = 0;
    let particles: Particle[] = [];

    function createParticleAtpointer(ev: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(ev.clientX - rect.left);
      const y = Math.floor(ev.clientY - rect.top);

      if (stage === "1") {
        drawParticle({ x, y, r: 16 });
        return;
      }
      if (stage === "2") {
        particles = [...particles, { x, y, r: 16 }];
        return;
      }

      /** Stage 3 */
      for (let i = 0; i < 60; i++) {
        const vy = Math.random() * 300 - 150;
        const vx = Math.random() * 300 - 150;
        const r = Math.random() * 14 + 1;
        particles = [...particles, { x, y, vx, vy, r }];
      }
    }

    function drawParticle(p: Particle) {
      context.fillStyle = "#f0abfc";
      context.beginPath();
      context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      context.fill();
    }

    function loop(timestamp: number) {
      let elapsedTime = Math.min((timestamp - lastFrame) / 1000, 0.1);
      lastFrame = timestamp;

      /** Update Particles */
      for (const p of particles) {
        p.r -= elapsedTime + 0.2;
        if (p.vx && p.vy) {
          p.x += p.vx * elapsedTime;
          p.y += p.vy * elapsedTime;
        }
      }

      /** Cleanup Particles */
      particles = particles.filter((p) => p.r > 0.1);

      /** Clear Canvas */
      context.clearRect(0, 0, canvas.width, canvas.height);

      /** Draw Particles */
      for (const p of particles) {
        drawParticle(p);
      }

      frameId = window.requestAnimationFrame(loop);
    }

    /** Start Animation loop in Stage 2 & 3 */
    if (stage !== "1") frameId = window.requestAnimationFrame(loop);

    return () => {
      canvas.removeEventListener("pointerdown", createParticleAtpointer);
      if (stage !== "1") window.cancelAnimationFrame(frameId);
    };
  });
</script>

<div
  class="my-6 border border-zinc-500 -mx-4 border-dashed rounded relative select-none"
  class:h-40={stage !== "3"}
  class:aspect-square={stage === "3"}
>
  <canvas bind:this={canvas} class="h-full w-full" />
  <span class="absolute abs-center pointer-events-none">click me</span>
</div>
