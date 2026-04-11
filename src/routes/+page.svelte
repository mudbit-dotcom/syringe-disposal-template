<!--
@component
This is your page!
-->

<script>
  import ArticleHeader from '$lib/components/ArticleHeader.svelte';
  import DatabaseHeader from '$lib/components/DatabaseHeader.svelte';
  import LocatorMap from '$lib/components/LocatorMap.svelte';
  import List from '$lib/components/List.svelte';
  import RankingCard from '$lib/components/RankingCard.svelte';
  import SearchInput from '$lib/components/SearchInput.svelte';
  import MethodologyBox from '$lib/components/MethodologyBox.svelte';

  let { data } = $props();
  let search = $state('');

  const syringes = $derived(data.syringes ?? []);

  const activeSyringes = $derived.by(() =>
    syringes.filter((item) => item?.status?.toLowerCase?.() === 'active')
  );

  const filteredActiveSyringes = $derived.by(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeSyringes;

    return activeSyringes.filter((item) => {
      const haystack = [
        item.borough,
        item.zipcode,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  });

  const top100 = $derived.by(() => filteredActiveSyringes.slice(0, 100));

  const mapPoints = $derived.by(() =>
    filteredActiveSyringes
      .filter((item) => item?.point?.coordinates?.length >= 2)
      .map((item) => ({
        longitude: item.point.coordinates[0],
        latitude: item.point.coordinates[1],
        borough: item.borough,
        model: item.model,
        kioskid: item.kioskid,
      }))
  );

  const mapCenter = $derived.by(() => {
    const firstWithPoint = filteredActiveSyringes.find((item) => item?.point?.coordinates?.length >= 2);
    if (firstWithPoint) {
      return {
        longitude: firstWithPoint.point.coordinates[0],
        latitude: firstWithPoint.point.coordinates[1],
      };
    }

    return {
      longitude: -73.9914662,
      latitude: 40.7555711,
    };
  });

  let headline = 'Syringe Disposal Kiosks in NYC Parks';
  let byline = 'Niya Doyle';
  let pubDate = '2026-04-11';
</script>

<DatabaseHeader
  kicker="Data Explorer"
  headline="Syringe Disposal Kiosks in NYC Parks"
  description="This data visualization shows the locations of syringe disposal kiosks across the five boroughs of New York City, providing insights into public health initiatives and community resources."
/>

<SearchInput
  label="Filter active kiosks"
  placeholder="Search by park, borough, model, location, or kiosk ID"
  bind:value={search}
/>

<LocatorMap
  longitude={mapCenter.longitude}
  latitude={mapCenter.latitude}
  zoom={10.5}
  theme="liberty"
  dot={true}
  points={mapPoints}
  caption="Syringe disposal kiosk locations from the NYC Parks dataset."
/>

<List title="Syringe Disposal Kiosks in NYC Parks Locations">
  {#each top100 as syringe, index (`${syringe.kioskid}-${index}`)}
    <RankingCard
      rank={index + 1}
      title={syringe.propertyname}
      value={syringe.borough}
    />
  {/each}
</List>

<MethodologyBox>
    <p>
      The data on this page comes from the Department of Parks and Recreation
      <a href="https://data.cityofnewyork.us/Public-Safety/Parks-Syringe-Disposal-Kiosks/r465-fr2q/about_data" target="_blank">via New York City's open data portal</a>.
    </p>
    <p>
      The citations published by the city were filtered to include only active kiosk sites. The data is current as of April 2026.
    </p>
  </MethodologyBox>

