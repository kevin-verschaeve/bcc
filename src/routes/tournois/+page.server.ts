import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: tournaments } = await supabase.from('tournaments').select().order('id', {ascending: false});

  return {
    tournaments: tournaments ?? []
  }
}
