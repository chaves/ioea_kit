<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { config } from '$lib/config';

	interface Props {
		data: {
			year: number;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Practical information - IOEA {data.year}</title>
</svelte:head>

<PageHeader title="Practical information - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="main-grid">
			<div class="main-content">
				<div class="info-section">
					<h2>Contact Information</h2>
					<p>
						<strong>Email</strong> : <a href="mailto:{config.emails.coordination}" class="text-link">{config.emails.coordination}</a>
					</p>
					<p>
						<strong>Postal address</strong> :<br />
						Professor Eric Brousseau<br />
						Université Paris Dauphine<br />
						Place du Maréchal de Lattre de Tassigny<br />
						75 775 Paris Cedex 16<br />
						France
					</p>
				</div>

				<div class="info-section">
					<h2>Financial information</h2>
					<ul>
						<li>
							<strong>Travel</strong> : Cargese is roughly one hour by car from the airport of Ajaccio. There are flights to Ajaccio from Paris, Marseille, Nice and major European hubs. The round-trip Paris-Ajaccio costs from {config.prices.travel.flightMin}€ (if booked in advance) to {config.prices.travel.flightMax}€. Be prompt in booking your flights ! For those flying from abroad, you should spend a Saturday night in France to benefit of cheaper fares on your international flight. This will enable you to enjoy either a weekend in the Island of Beauty or the nightlife in Paris. Transfer by bus is organized from Ajaccio airport to the Cargese institute: it costs {config.prices.travel.busTransfer}€ (Ajaccio/Cargese/Ajaccio).
						</li>
						<li>
							<strong>Accommodation</strong> : Lodging in Cargese is mostly organized in apartments in the village or in rooms at the Institute. You will benefit from a room for the duration of your stay (from Sunday to Saturday) for {config.prices.accommodation.roomPerWeek}€/week. Hotel rooms are available as well from {config.prices.accommodation.hotelPerNight}€ per night.
						</li>
						<li>
							<strong>Meals</strong> : You will benefit from lunches and two coffee breaks at the Institute for a weekly rate of {config.prices.meals.weeklyRate}€. A farewell party will be organized on Friday night. Evening meals are on your own in the village.
						</li>
						<li>
							<strong>Registration fees</strong> : {config.prices.registration.fee}€ per person.
						</li>
					</ul>
				</div>
			</div>

			<aside class="sidebar">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

<style>
	.main-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 3rem;
	}

	.info-section {
		margin-bottom: 3rem;
	}

	.info-section h2 {
		margin-bottom: 1.5rem;
		color: var(--color-primary);
		font-size: 1.5rem;
	}

	.info-section p {
		line-height: 1.7;
		margin-bottom: 1rem;
		font-size: 1.05rem;
	}

	.info-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.info-section li {
		margin-bottom: 1.5rem;
		line-height: 1.7;
		font-size: 1.05rem;
	}

	.info-section li strong {
		color: var(--color-primary);
		font-weight: 600;
	}

	.sidebar {
		position: sticky;
		top: 100px;
		align-self: start;
	}

	@media (max-width: 1024px) {
		.main-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
		}
	}
</style>
