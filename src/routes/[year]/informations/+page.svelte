<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { config } from '$lib/config';

	interface Props {
		data: {
			year: number;
		};
	}

	let { data }: Props = $props();
</script>

<SEO
	title="Practical information - IOEA {data.year}"
	description="Practical information for the IOEA {data.year} session including travel, accommodation, and registration details."
/>

<PageHeader title="Practical information - IOEA {data.year}" />

<section class="section-space">
	<div class="container">
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
			<div class="main-content">
				<div class="mb-12">
					<h2 class="mb-8 text-primary text-2xl font-bold border-b-2 border-secondary pb-2">Contact Information</h2>
					<p class="leading-relaxed mb-6 text-base sm:text-[1.1rem] text-text">
						<strong class="font-bold">Email</strong> : <a href="mailto:{config.emails.coordination}" class="text-link font-medium">{config.emails.coordination}</a>
					</p>
					<p class="leading-relaxed mb-0 text-base sm:text-[1.1rem] text-text">
						<strong class="font-bold">Postal address</strong> :<br />
						<span class="block mt-2">
							Professor Eric Brousseau<br />
							Université Paris Dauphine<br />
							Place du Maréchal de Lattre de Tassigny<br />
							75 775 Paris Cedex 16<br />
							France
						</span>
					</p>
				</div>

				<div class="mb-12">
					<h2 class="mb-8 text-primary text-2xl font-bold border-b-2 border-secondary pb-2">Financial information</h2>
					<ul class="list-none p-0 m-0 space-y-10">
						<li class="leading-relaxed text-base sm:text-[1.05rem] text-text">
							<strong class="text-lg font-bold text-primary block mb-2">Travel</strong>
							Cargese is roughly one hour by car from the airport of Ajaccio. There are flights to Ajaccio from Paris, Marseille, Nice and major European hubs. The round-trip Paris-Ajaccio costs from {config.prices.travel.flightMin}€ (if booked in advance) to {config.prices.travel.flightMax}€. Be prompt in booking your flights ! For those flying from abroad, you should spend a Saturday night in France to benefit of cheaper fares on your international flight. This will enable you to enjoy either a weekend in the Island of Beauty or the nightlife in Paris. Transfer by bus is organized from Ajaccio airport to the Cargese institute: it costs {config.prices.travel.busTransfer}€ (Ajaccio/Cargese/Ajaccio).
						</li>
						<li class="leading-relaxed text-base sm:text-[1.05rem] text-text">
							<strong class="text-lg font-bold text-primary block mb-2">Accommodation</strong>
							Lodging in Cargese is mostly organized in apartments in the village or in rooms at the Institute. You will benefit from a room for the duration of your stay (from Sunday to Saturday) for {config.prices.accommodation.roomPerWeek}€/week. Hotel rooms are available as well from {config.prices.accommodation.hotelPerNight}€ per night.
						</li>
						<li class="leading-relaxed text-base sm:text-[1.05rem] text-text">
							<strong class="text-lg font-bold text-primary block mb-2">Meals</strong>
							You will benefit from lunches and two coffee breaks at the Institute for a weekly rate of {config.prices.meals.weeklyRate}€. A farewell party will be organized on Friday night. Evening meals are on your own in the village.
						</li>
						<li class="leading-relaxed text-base sm:text-[1.05rem] text-text">
							<strong class="text-lg font-bold text-primary block mb-2">Registration fees</strong>
							{config.prices.registration.fee}€ per person.
						</li>
					</ul>
				</div>
			</div>

			<aside class="sticky top-[100px] self-start hidden lg:block">
				<Sidebar />
			</aside>
		</div>
	</div>
</section>

