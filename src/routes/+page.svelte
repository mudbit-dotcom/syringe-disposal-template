<!--
@component
This is your page!
-->

 <script>
  import ArticleHeader from '$lib/components/ArticleHeader.svelte';

  let { data } = $props();

  let headline = 'Syringe Disposal Kiosks in NYC Parks';
  let byline = 'NYCity News Service';
  let pubDate = '2026-03-30';
</script>

<svelte:head>
  <title>{headline} | NYCity News Service</title>
</svelte:head>

<div class="container">
  <ArticleHeader
    {headline}
    {byline}
    {pubDate}
  />
<div class="syringe-kiosks">
    {#each data.syringes as syringe}
      <div class="card">
        <h3>{syringe.model}</h3>
        <p>{syringe.borough}</p>
      </div>
    {/each}
  </div>
</div>
