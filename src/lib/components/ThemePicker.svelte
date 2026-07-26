<script lang="ts" module>
	export type Theme = 'brutalist' | 'app' | 'skeuomorphe';
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	type ThemeOption = {
		id: Theme;
		label: string;
		hint: string;
	};

	const OPTIONS: ThemeOption[] = [
		{ id: 'brutalist', label: 'Brutal', hint: 'Blocs, ombres dures' },
		{ id: 'app', label: 'Classique', hint: 'Épuré, arrondi' },
		{ id: 'skeuomorphe', label: 'Skeuomorphe', hint: 'Tapis, papier, cuivre' }
	];

	let { theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void } = $props();

	let open = $state(false);
	let root = $state<HTMLDivElement>();
	let trigger = $state<HTMLButtonElement>();

	// While the popover is open we apply the hovered theme live, so the whole
	// page acts as the preview. `committed` is the theme to fall back to if the
	// user leaves without choosing.
	let committed = $state<Theme>(theme);

	const current = $derived(OPTIONS.find((o) => o.id === theme) ?? OPTIONS[0]);

	// Preview only flips the attribute — it must not touch localStorage, or an
	// abandoned hover would persist a theme the user never picked.
	const preview = (next: Theme) => {
		if (!open) return;
		document.documentElement.dataset.bccTheme = next;
	};

	const restore = () => {
		if (!open) return;
		document.documentElement.dataset.bccTheme = committed;
	};

	const openPopover = () => {
		committed = theme;
		open = true;
	};

	const closePopover = (opts: { restoreTheme?: boolean; focusTrigger?: boolean } = {}) => {
		const { restoreTheme = true, focusTrigger = false } = opts;
		if (restoreTheme) document.documentElement.dataset.bccTheme = committed;
		open = false;
		if (focusTrigger) trigger?.focus();
	};

	const choose = (next: Theme) => {
		committed = next;
		setTheme(next);
		closePopover({ restoreTheme: false, focusTrigger: true });
	};

	const onKeydown = (event: KeyboardEvent) => {
		if (!open) return;
		if (event.key === 'Escape') {
			event.stopPropagation();
			closePopover({ focusTrigger: true });
		}
	};

	// On mobile the options render inline inside the drawer (no floating panel
	// to open), so the list must always be present there. Matches the same
	// breakpoint as the drawer styles in base.css.
	let isCompact = $state(false);

	// Close on any outside interaction. Pointerdown rather than click so the
	// popover dismisses before a click lands on whatever is underneath.
	onMount(() => {
		const mq = window.matchMedia('(max-width: 768px)');
		const syncCompact = () => {
			isCompact = mq.matches;
			if (isCompact) open = false;
		};
		syncCompact();
		mq.addEventListener('change', syncCompact);

		const onPointerDown = (event: PointerEvent) => {
			if (!open) return;
			if (root && !root.contains(event.target as Node)) closePopover();
		};
		document.addEventListener('pointerdown', onPointerDown);

		return () => {
			mq.removeEventListener('change', syncCompact);
			document.removeEventListener('pointerdown', onPointerDown);
		};
	});
</script>

<svelte:window on:keydown={onKeydown} />

<div class="theme-picker" bind:this={root}>
	<button
		type="button"
		class="theme-picker-trigger"
		bind:this={trigger}
		aria-haspopup="true"
		aria-expanded={open}
		aria-label={`Thème : ${current.label}. Changer de thème`}
		onclick={() => (open ? closePopover() : openPopover())}
	>
		<span class="theme-swatch" data-swatch={theme} aria-hidden="true">
			<span class="theme-swatch-bar"></span>
			<span class="theme-swatch-dot"></span>
		</span>
		<!-- aria-hidden: the button's aria-label already says "Thème : …", so
		     exposing this prefix too would announce it twice. -->
		<span class="theme-picker-trigger-prefix" aria-hidden="true">Thème :</span>
		<span class="theme-picker-trigger-label">{current.label}</span>
		<span class="theme-picker-caret" aria-hidden="true">▾</span>
	</button>

	{#if open || isCompact}
		<!-- Section heading for the drawer, where the options render inline with
		     no trigger to label them. Hidden on desktop via CSS, and aria-hidden
		     because the radiogroup below already carries an accessible name. -->
		<span class="theme-picker-section-label" aria-hidden="true">Thème</span>
		<!-- `radiogroup` rather than `menu`: picking a theme is a single choice
		     from a set, and `menu` would require roving-tabindex focus
		     management that adds nothing over plain Tab order here. -->
		<div
			class="theme-picker-menu"
			role="radiogroup"
			aria-label="Choix du thème"
			onmouseleave={restore}
		>
			{#each OPTIONS as option (option.id)}
				<button
					type="button"
					class="theme-picker-option"
					role="radio"
					aria-checked={option.id === theme}
					onclick={() => choose(option.id)}
					onmouseenter={() => preview(option.id)}
					onfocus={() => preview(option.id)}
					onblur={restore}
				>
					<span class="theme-swatch" data-swatch={option.id} aria-hidden="true">
						<span class="theme-swatch-bar"></span>
						<span class="theme-swatch-dot"></span>
					</span>
					<span class="theme-picker-option-text">
						<span class="theme-picker-option-label">{option.label}</span>
						<span class="theme-picker-option-hint">{option.hint}</span>
					</span>
					<span class="theme-picker-check" aria-hidden="true">
						{option.id === theme ? '✓' : ''}
					</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
