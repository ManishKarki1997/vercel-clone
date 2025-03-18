

const getProjectIdBySlug = async ({ slug, apiServerUrl }: { slug: string, apiServerUrl: string }) => {

	if (!apiServerUrl) return ""
	const response = await fetch(`${apiServerUrl}/api/v1/projects/slug-to-id/${slug}`)
	const data = await response.json()

	return (data as any)?.data || ""
}

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {

		const AWS_BUCKET_PATH = env.AWS_BUCKET_PATH
		const API_SERVER_URL = env.API_SERVER_URL


		const url = new URL(request.url)
		const subdomain = url.hostname.split('.')[0]

		const projectId = await getProjectIdBySlug({ slug: subdomain, apiServerUrl: API_SERVER_URL })

		// console.log("projectId", projectId)

		if (!projectId) {
			return new Response("Project not found")
		}

		let targetURL = `${AWS_BUCKET_PATH}/${projectId}/index.html`


		// console.log("targetURL", targetURL)

		// return new Response("Hello World")
		return Response.redirect(targetURL, 302)
	},
} satisfies ExportedHandler<Env>;
