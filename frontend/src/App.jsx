import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppShell } from './layouts/AppShell'
import { Admin } from './pages/Admin'
import { Auth } from './pages/Auth'
import { Bookmarks } from './pages/Bookmarks'
import { BrowseNotes } from './pages/BrowseNotes'
import { Collections } from './pages/Collections'
import { Dashboard } from './pages/Dashboard'
import { EditNote } from './pages/EditNote'
import { ExamPrep } from './pages/ExamPrep'
import { ForgotPassword } from './pages/ForgotPassword'
import { Landing } from './pages/Landing'
import { NoteDetail } from './pages/NoteDetail'
import { NotFound } from './pages/NotFound'
import { Papers } from './pages/Papers'
import { ResetPassword } from './pages/ResetPassword'
import { Roadmap } from './pages/Roadmap'
import { UploadNote } from './pages/UploadNote'

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<BrowseNotes />} />
          <Route path="/notes/:id" element={<NoteDetail />} />
          <Route
            path="/notes/:id/edit"
            element={
              <ProtectedRoute>
                <EditNote />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="/auth/reset" element={<ResetPassword />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadNote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collections"
            element={
              <ProtectedRoute>
                <Collections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/exam-prep" element={<ExamPrep />} />
          <Route path="/papers" element={<Papers />} />
          <Route path="/roadmap" element={<Navigate to="/roadmap/CS302" replace />} />
          <Route path="/roadmap/:code" element={<Roadmap />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/test" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Test Route Working!</h1><p>If you can see this, routing is working.</p></div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
