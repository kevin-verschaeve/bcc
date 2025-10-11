<script lang="ts">
	import { enhance } from '$app/forms';
	import { Calendar, TimeGrid, Interaction } from '@event-calendar/core';
	import '@event-calendar/core/index.css';
	import type { PageData } from './$types';
	import { isoDate } from '$lib/utils';

	let { data }: { data: PageData } = $props();

	let ec: any;

	interface TimeSlot {
		id: string;
		start: string;
		end: string;
	}

	function generateId() {
		return Math.random().toString(36).substring(2, 11);
	}

	let selectedSlots = $state<TimeSlot[]>(
		(data.team.availabilities || []).map((item: any) => {
			return {
				id: item.id || generateId(),
				start: String(item.start || ''),
				end: String(item.end || '')
			};
		}).filter(slot => slot.start && slot.end)
	);

	function syncFromCalendar() {
		const allEvents = ec.getEvents();
		selectedSlots = allEvents.map((event: any) => ({
			id: event.id,
			start: isoDate(event.start),
			end: isoDate(event.end)
		}));
	}

	if (typeof window !== 'undefined') {
		(window as any).deleteEvent = (eventId: string) => {
			ec.removeEventById(eventId);
			syncFromCalendar();
		};
	}

	let options = {
		view: 'timeGridWeek',
		events: selectedSlots
			.filter((slot) => slot.start && slot.end)
			.map((slot) => ({
				id: String(slot.id),
				start: String(slot.start),
				end: String(slot.end),
				backgroundColor: '#10b981',
				title: 'Disponible'
			})),
		selectable: true,
		editable: true,
		select: (info: any) => {
			ec.addEvent({
				id: generateId(),
				start: info.startStr,
				end: info.endStr,
				backgroundColor: '#10b981',
				title: 'Disponible'
			});
			syncFromCalendar();
		},
		eventDrop: (info: any) => {
			syncFromCalendar();
		},
		eventResize: (info: any) => {
			syncFromCalendar();
		},
		eventContent: (info: any) => {
			// Custom event rendering with delete button
			return {
				html: `
					<div style="display: flex; justify-content: space-between">
						${info.timeText}
						<button
							onclick="event.stopPropagation(); window.deleteEvent('${info.event.id}')"
							style="background: rgba(255,255,255,0.3); border: none; border-radius: 3px; color: white; cursor: pointer; padding: 0 8px; font-size: 12px; line-height: 1;"
							data-tooltip="Supprimer"
						>✕</button>
					</div>
					<span style="font-size: 0.8em">${info.event.title}</span>
				`
			};
		},
		allDayContent: 'Jour',
		headerToolbar: {
			start: 'prev,next',
			center: 'title',
		},
		locale: 'fr',
		firstDay: 1,
		slotMinTime: '08:00:00',
		slotMaxTime: '24:00:00',
		slotDuration: '00:30:00',
	};
</script>

<a href="/equipes" class="secondary">&larr; Retour aux équipes</a>

<h1>Disponibilités - {data.team.name}</h1>
<p><small>{data.team.player1.name} - {data.team.player2.name}</small></p>

<article>
	<section>
	    <Calendar bind:this={ec} plugins={[TimeGrid, Interaction]} {options} />
	</section>

	<form
		method="POST"
		action="?/saveAvailabilities"
		use:enhance
	>
		<input
			type="hidden"
			name="availabilities"
			value={JSON.stringify(selectedSlots)}
		/>

		<button type="submit">Enregistrer</button>
	</form>
</article>
