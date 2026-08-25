import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import { AlertCircle, ArrowLeft, LockKeyhole } from 'lucide-react'
import { loginSchema, type LoginFormValues } from '../../lib/validation'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'

export function AdminLoginPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginFormValues) {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setError('root', { message: 'Invalid email or password.' })
      throw error
    }

    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/admin'
    navigate(redirectTo, { replace: true })
  }

  if (!loading && session) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-16">
      <Container className="max-w-sm">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-plum-600 hover:text-plum-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="rounded-2xl border border-plum-100 bg-cream-50 p-8 shadow-soft">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-plum-100 text-plum-700">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-center font-display text-2xl font-semibold text-plum-900">
            Admin Login
          </h1>
          <p className="mt-1 text-center text-sm text-plum-600">
            Sign in to review fellowship applications.
          </p>

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
              <span className="mb-1.5 block text-sm font-medium text-plum-800">Email</span>
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className={inputClass(!!errors.email)}
              />
              {errors.email && <span className="mt-1 block text-sm text-red-600">{errors.email.message}</span>}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-plum-800">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={inputClass(!!errors.password)}
              />
              {errors.password && (
                <span className="mt-1 block text-sm text-red-600">{errors.password.message}</span>
              )}
            </label>

            <Button type="submit" loading={isSubmitting} className="w-full">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-cream-50 px-4 py-2.5 text-plum-900 focus:outline-none focus:ring-2 focus:ring-plum-600 ${
    hasError ? 'border-red-400' : 'border-plum-200'
  }`
}
