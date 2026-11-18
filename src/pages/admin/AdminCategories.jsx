import { useState } from 'react'
import CategoryForm from '../../components/admin/CategoryForm'
import CategoryRow from '../../components/admin/CategoryRow'
import Card from '../../components/ui/Card'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import PageLoader from '../../components/ui/PageLoader'
import { useAsync } from '../../hooks/useAsync'
import { useSessionExpiry } from '../../hooks/useSessionExpiry'
import { useToast } from '../../hooks/useToast'
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  renameCategory,
} from '../../services/adminService'
import { getCategoryErrorMessage } from '../../utils/categoryErrors'
import { slugify } from '../../utils/slug'

function AdminCategories() {
  const toast = useToast()
  const handleSessionError = useSessionExpiry()
  const { data, isLoading, error, retry } = useAsync(getAdminCategories)
  const categories = data ?? []

  const [busyId, setBusyId] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  // These two throw on failure, and the forms show the error inline.
  async function handleCreate(name) {
    await createCategory({ name, slug: slugify(name, 60) })
    toast.success('Category added.')
    retry()
  }

  async function handleRename(category, name) {
    await renameCategory(category.id, name)
    toast.success('Category renamed.')
    retry()
  }

  async function handleConfirmDelete() {
    const category = categoryToDelete
    setBusyId(category.id)
    try {
      await deleteCategory(category.id, category.slug)
      toast.success('Category deleted.')
      retry()
    } catch (err) {
      console.error(err)
      if (!(await handleSessionError(err))) toast.error(getCategoryErrorMessage(err))
      if (err.type === 'category_in_use') retry() // our counts were out of date
    } finally {
      setBusyId(null)
      setCategoryToDelete(null)
    }
  }

  function renderList() {
    if (isLoading && !data) return <PageLoader />
    if (error) return <ErrorState title="Couldn't load categories" message={error} onRetry={retry} />
    if (categories.length === 0) {
      return <EmptyState title="No categories yet" description="Add your first category above." />
    }

    return (
      <ul className={`space-y-4 ${isLoading ? 'opacity-60 transition-opacity' : ''}`}>
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            isBusy={busyId === category.id}
            onRename={handleRename}
            onDelete={setCategoryToDelete}
          />
        ))}
      </ul>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Categories</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Organize posts into topics. Authors pick one when publishing.
      </p>

      <div className="mt-8 max-w-xl">
        <Card title="Add a category">
          <CategoryForm onCreate={handleCreate} />
        </Card>
      </div>

      <div className="mt-8">{renderList()}</div>

      <ConfirmDialog
        open={categoryToDelete !== null}
        title="Delete this category?"
        description={`"${categoryToDelete?.name ?? ''}" will be permanently deleted. No posts use it.`}
        confirmLabel="Delete"
        isLoading={categoryToDelete !== null && busyId === categoryToDelete.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  )
}

export default AdminCategories