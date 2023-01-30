<script lang="ts">
	import { onMount } from "svelte";
	import { spring } from "svelte/motion";

	/**
	 * TODOS:
	 * 	- Resize Event
	 */

	/* Accessibility */
	let reducedMotion = false;
	onMount(() => {
		const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
		reducedMotion = window.matchMedia(reducedMotionQuery).matches;

		const updateReducedMotion = (ev: MediaQueryListEvent) => {
			reducedMotion = ev.matches;
		};

		const mediaQueryList = window.matchMedia(reducedMotionQuery);
		mediaQueryList.addEventListener("change", updateReducedMotion);

		/* reset animation when page is not visible */
		const handleVisibilityChange = (_ev: Event) => {
			if (document.hidden) {
				resetSpring(true);
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			mediaQueryList.removeEventListener("change", updateReducedMotion);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	});

	/* Dom Element */
	let card: HTMLDivElement;
	$: rect = card?.getBoundingClientRect();

	/* Spring Animation */
	const coords = spring({ x: 0, y: 0 }, { stiffness: 0.05, damping: 0.99 });

	function resetSpring(immediate = false) {
		coords.set({ y: 0, x: 0 }, { soft: 4, hard: immediate || reducedMotion });
	}

	function handleMove(ev: PointerEvent) {
		if (reducedMotion || !rect) {
			resetSpring();
			return;
		}
		coords.set({
			y: ((ev.clientX - rect.left) / rect.width - 0.5) * 28,
			x: -((ev.clientY - rect.top) / rect.height - 0.5) * 36,
		});
	}

	/* Dynamic CSS Variables */
	$: css = Object.entries($coords)
		.map(
			([key, value]) => `
			--${key}:${value * 0.8}deg;
			--bg-${key}:${value * 0.4}deg
			`
		)
		.join(";");
</script>

<div
	class={$$props.class + " card"}
	bind:this={card}
	on:pointerleave={() => resetSpring()}
	on:pointermove={handleMove}
	style="width: fit-content;margin: auto;"
>
	<div
		class="wrapper after:bg-gradient-to-tr after:from-pink-200 after:via-cyan-100 after:to-teal-50"
		style={css}
	>
		<div class="content">
			<slot />
		</div>
	</div>
</div>

<style>
	:root {
		--shadow-small: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
			rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
		--shadow-big: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
			rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.2) 0px 30px 60px -30px;
		--card-border: #fcf6f5;
	}
	/* @media (prefers-color-scheme: dark) {
		:root {
			--card-border: #c9d1d9;
		}
	} */
	.card {
		margin: auto;
	}
	.wrapper {
		border-radius: 0.25rem;
		transform-style: preserve-3d;
		transform: perspective(1000px) rotateX(var(--x, 0deg)) rotateY(var(--y, 0deg)) translateZ(0);
		backface-visibility: hidden;
		position: relative;
	}
	.wrapper::after {
		content: "";
		position: absolute;
		height: 105%;
		width: 110%;
		border-radius: 2px;
		inset: 0;
		border: 2px solid var(--card-border);
		/* background: linear-gradient(45deg, var(--red) 0%, var(--blue) 100%); */
		transform-style: preserve-3d;
		box-shadow: var(--shadow-big);
		transform: perspective(1000px) translate3d(-5%, -2.5%, -64px) rotateX(var(--bg-x))
			rotateY(var(--bg-y));
	}
	.content {
		padding: 2rem;
	}
	.content :global(pre) {
		font-size: 20px;
		padding: 2rem 3rem;
		border-radius: 2px;
		line-height: 1.3;
		box-shadow: var(--shadow-small);
		border: 2px solid var(--card-border);
	}
</style>
