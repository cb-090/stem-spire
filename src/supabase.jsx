import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://mtjpyqatrtujdzpsireh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10anB5cWF0cnR1amR6cHNpcmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NjgzMzksImV4cCI6MjA2MzU0NDMzOX0.fKJSJByhk1D4gdkym1MI7-GR7C_3anaIc30Z-qa4SlI'

export const supabase = createClient(supabaseUrl, supabaseKey)
