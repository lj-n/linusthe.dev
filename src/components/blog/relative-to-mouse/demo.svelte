<script lang="ts">
  import { onMount } from "svelte";

  export let text = "move pointer over me";

  let card: HTMLDivElement;
  let timeout: number | null = null;

  onMount(() => {
    card.addEventListener("pointermove", handleMove);
    card.addEventListener("pointerleave", handleLeave);

    function handleMove(ev: PointerEvent) {
      if (timeout) clearTimeout(timeout);

      const rect = card.getBoundingClientRect();
      const x = -((ev.clientY - rect.top) / rect.height - 0.5) * 36;
      const y = ((ev.clientX - rect.left) / rect.width - 0.5) * 28;

      card.style.setProperty("--wrapper-rotation-x", `${x * 0.8}deg`);
      card.style.setProperty("--wrapper-rotation-y", `${y * 0.8}deg`);
      card.style.setProperty("--after-rotation-x", `${x * 0.4}deg`);
      card.style.setProperty("--after-rotation-y", `${y * 0.4}deg`);
    }
    function handleLeave(ev: PointerEvent) {
      timeout = setTimeout(() => {
        card.style.setProperty("--wrapper-rotation-x", "0deg");
        card.style.setProperty("--wrapper-rotation-y", "0deg");
        card.style.setProperty("--after-rotation-x", "0deg");
        card.style.setProperty("--after-rotation-y", "0deg");
        timeout = null;
      }, 300);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      card.removeEventListener("pointermove", handleMove);
      card.removeEventListener("pointerleave", handleLeave);
    };
  });
</script>

<div bind:this={card} class="p-4 -mx-4">
  <div class="wrapper rounded my-10 border border-zinc-100 bg-zinc-800 flex after:bg-gradient-to-tr after:from-fuchsia-200 after:to-indigo-200 after:rounded">
    <div class="content select-none">
      <span>{text}</span>
    </div>
  </div>
</div>

<style>
  .wrapper {
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateX(var(--wrapper-rotation-x, 0deg))
      rotateY(var(--wrapper-rotation-y, 0deg)) translateZ(0);
    backface-visibility: hidden;
    position: relative;
    transition: transform 200ms ease-out;
  }
  .wrapper::after {
    content: "";
    position: absolute;
    height: 120%;
    width: 120%;
    inset: 0;
    transform-style: preserve-3d;
    transform: perspective(1000px) translate3d(-9%, -9%, -80px)
      rotateX(var(--after-rotation-x, 0deg)) rotateY(var(--after-rotation-y, 0deg));
    transition: transform 300ms ease-out;
  }
  .content {
    padding: 3rem 2rem;
	margin: auto;
	display: flex;
	flex-direction: column;
  }
</style>
