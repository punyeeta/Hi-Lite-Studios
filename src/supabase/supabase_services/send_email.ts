import { supabase } from '@/supabase/client'

export async function sendCustomBookingEmail(
  clientEmail: string,
  clientName: string,
  customMessage: string,
  status: string = 'confirmed',
) {
  try {
    const { data, error } = await supabase.functions.invoke('send-custom-booking-email', {
      body: {
        clientEmail,
        clientName,
        customMessage,
        status,
      },
    })

    if (error) throw new Error(error.message || 'Failed to send email')

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
