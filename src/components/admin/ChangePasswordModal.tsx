import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { changePasswordSchema, type ChangePasswordFormValues } from '../../lib/validation'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../ui/Button'

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
}

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    reset,
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) })

  async function onSubmit(values: ChangePasswordFormValues) {
    const { error } = await supabase.auth.updateUser({ password: values.newPassword })

    if (error) {
      setError('root', {
        message: error.message || 'Could not update your password. Please try again.',
      })
      throw error
    }
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-plum-950/60 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-cream-50 p-6 shadow-soft sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-plum-900">Change Password</h2>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1.5 text-plum-500 hover:bg-plum-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isSubmitSuccessful ? (
              <div className="mt-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-gold-500" />
                <p className="mt-3 font-medium text-plum-900">Password updated!</p>
                <p className="mt-1 text-sm text-plum-600">
                  Use your new password the next time you sign in.
                </p>
                <Button className="mt-6 w-full" onClick={handleClose}>
                  Done
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  handleSubmit(onSubmit)(event).catch(() => {})
                }}
                noValidate
                className="mt-6 space-y-4"
              >
                {errors.root && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errors.root.message}</span>
                  </div>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-plum-800">
                    New password
                  </span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    {...register('newPassword')}
                    className={inputClass(!!errors.newPassword)}
                  />
                  {errors.newPassword && (
                    <span className="mt-1 block text-sm text-red-600">
                      {errors.newPassword.message}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-plum-800">
                    Confirm new password
                  </span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className={inputClass(!!errors.confirmPassword)}
                  />
                  {errors.confirmPassword && (
                    <span className="mt-1 block text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </label>

                <Button type="submit" loading={isSubmitting} className="w-full">
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-cream-50 px-4 py-2.5 text-plum-900 focus:outline-none focus:ring-2 focus:ring-plum-600 ${
    hasError ? 'border-red-400' : 'border-plum-200'
  }`
}
