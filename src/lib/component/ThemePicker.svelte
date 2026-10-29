<script lang="ts" module>
	export type Theme = 'brutalist' | 'app' | 'skeuomorphe';
</script>

<script lang="ts">
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

	// Desktop: a gear opens a dropdown. Mobile: CSS shows the group inline in
	// the drawer and hides the gear, so `open` is irrelevant there.
	let open = $state(false);
	let root = $state<HTMLDivElement>();
	let trigger = $state<HTMLButtonElement>();

	// Hovering or focusing an option previews the theme on the whole page. Only
	// the attribute flips — localStorage is untouched until the user clicks.
	const preview = (next: Theme) => {
		document.documentElement.dataset.bccTheme = next;
	};
	const restore = () => {
		document.documentElement.dataset.bccTheme = theme;
	};

	const close = (focusTrigger = false) => {
		restore();
		open = false;
		if (focusTrigger) trigger?.focus();
	};

	const choose = (next: Theme) => {
		setTheme(next);
		open = false;
		trigger?.focus();
	};

	const onKeydown = (event: KeyboardEvent) => {
		if (open && event.key === 'Escape') {
			event.stopPropagation();
			close(true);
		}
	};

	const onPointerDown = (event: PointerEvent) => {
		if (open && root && !root.contains(event.target as Node)) close();
	};
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerDown} />

<div class="theme-picker" bind:this={root}>
	<button
		type="button"
		class="theme-picker-trigger"
		bind:this={trigger}
		aria-haspopup="true"
		aria-expanded={open}
		aria-label="Réglages : thème"
		title="Réglages"
		onclick={() => (open ? close() : (open = true))}
	>
		<svg
			viewBox="0 0 24 24"
			width="20"
			height="20"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="3" />
			<path
				d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
			/>
		</svg>
	</button>

	<div
		class="theme-picker-group"
		class:open
		role="radiogroup"
		aria-label="Choix du thème"
		onmouseleave={restore}
	>
		<span class="theme-picker-section-label" aria-hidden="true">Thème</span>
		{#each OPTIONS as option (option.id)}
			<button
				type="button"
				class="theme-picker-option"
				role="radio"
				aria-checked={option.id === theme}
				tabindex={open ? 0 : undefined}
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
				<span class="theme-picker-check" aria-hidden="true">{option.id === theme ? '✓' : ''}</span>
			</button>
		{/each}
	</div>
</div>
