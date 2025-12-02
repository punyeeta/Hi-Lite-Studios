import { memo, useMemo, useState, useCallback } from 'react'
import type { BlogStory } from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'
import { BLOG_COLORS } from './constants'

interface BlogListViewProps {
  stories: BlogStory[]
  pinnedStories: BlogStory[]
  otherStories: BlogStory[]
  loading: boolean
  saving: boolean
  error: string | null
  onNewStory: () => void
  onEditStory: (story: BlogStory) => void
  onDeleteStory: (story: BlogStory) => Promise<void>
  onPinToggle: (story: BlogStory) => Promise<void>
}

interface StoryCardProps {
  story: BlogStory
  saving: boolean
  onEdit: (story: BlogStory) => void
  onDelete: (story: BlogStory) => Promise<void>
  onPinToggle: (story: BlogStory) => Promise<void>
}

const StoryCard = memo(function StoryCard({
  story,
  saving,
  onEdit,
  onDelete,
  onPinToggle,
}: StoryCardProps) {
  const handleEdit = useCallback(() => onEdit(story), [story, onEdit])
  const handleDelete = useCallback(() => onDelete(story), [story, onDelete])
  const handlePin = useCallback(() => onPinToggle(story), [story, onPinToggle])

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-3">
        <div className="relative w-full bg-gray-100 overflow-hidden rounded-lg" style={{ aspectRatio: '16/9' }}>
          {story.cover_image ? (
            <img
              src={story.cover_image}
              alt={story.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No cover image
            </div>
          )}
          {story.is_pinned && (
            <span className="absolute left-3 top-3 rounded-full text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm px-3 py-1" style={{ backgroundColor: BLOG_COLORS.PRIMARY_RED }}>
              Pinned
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
            {story.title}
          </h3>
          <p className="text-[11px] uppercase tracking-wide text-gray-400">
            {new Date(story.created_at).toLocaleDateString()} •{' '}
            <span
              className={
                story.status === 'published'
                  ? 'text-green-600'
                  : story.status === 'draft'
                  ? 'text-gray-500'
                  : 'text-red-500'
              }
            >
              {story.status}
            </span>
          </p>
        </div>

        <p className="line-clamp-3 text-xs text-gray-600">
          {story.excerpt || 'No excerpt yet.'}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={handlePin}
            className={`rounded-lg px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105 ${
              story.is_pinned
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'text-white hover:scale-105'
            }`}
            style={!story.is_pinned ? { backgroundColor: BLOG_COLORS.PRIMARY_RED } : {}}
          >
            {story.is_pinned ? 'Remove Pin' : 'Pin'}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: BLOG_COLORS.PRIMARY_PURPLE }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="rounded-lg px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-700 shadow-sm transition-all duration-150 hover:bg-gray-200 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed"
              style={{ background: BLOG_COLORS.LIGHT_GRAY_GRADIENT }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  )
})

export default memo(function BlogListView({
  stories,
  pinnedStories: _pinnedStories,
  otherStories: _otherStories,
  loading,
  saving,
  error,
  onNewStory,
  onEditStory,
  onDeleteStory,
  onPinToggle,
}: BlogListViewProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const filtered = useMemo(() => {
    return stories.filter((s) => (filter === 'all' ? true : s.status === filter))
  }, [stories, filter])
  const filteredPinned = useMemo(() => filtered.filter((s) => s.is_pinned), [filtered])
  const filteredOthers = useMemo(() => filtered.filter((s) => !s.is_pinned), [filtered])

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as any)
  }, [])

  const handleNewStory = useCallback(() => {
    onNewStory()
  }, [onNewStory])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleNewStory}
          className="rounded-lg bg-[#291471] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-150 hover:bg-[#1e0f55] hover:shadow-lg hover:scale-105"
        >
          Add New Blog
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">Filter:</span>
            <select
              value={filter}
              onChange={handleFilterChange}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm focus:border-[#291471] focus:outline-none focus:ring-1 focus:ring-[#291471]"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Show count for all filters */}
          <p className="text-s text-[#333333]">
            Showing <strong>{filtered.length}</strong>{' '}
            {filter === 'draft'
              ? 'draft post' + (filtered.length !== 1 ? 's' : '')
              : filter === 'archived'
              ? 'archived post' + (filtered.length !== 1 ? 's' : '')
              : filter === 'published'
              ? 'published post' + (filtered.length !== 1 ? 's' : '')
              : 'post' + (filtered.length !== 1 ? 's' : '')}
          </p>
        </div>
      </div>


      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !stories.length ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={`skeleton-${index}`}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse"
            >
              <div className="p-3">
                <div className="w-full bg-gray-300 rounded-lg" style={{ aspectRatio: '16/9' }} />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="space-y-2">
                  <div className="h-5 w-3/4 rounded bg-gray-300" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-5/6 rounded bg-gray-200" />
                  <div className="h-3 w-4/6 rounded bg-gray-200" />
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div className="h-7 w-20 rounded-full bg-gray-200" />
                  <div className="flex gap-2">
                    <div className="h-7 w-16 rounded-full bg-gray-200" />
                    <div className="h-7 w-16 rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border-dashed px-6 py-12 text-center text-xl text-gray-500">
          {filter === 'draft' && (
            <span>No draft posts.</span>
          )}
          {filter === 'archived' && (
            <span>No archived posts.</span>
          )}
          {filter === 'published' && (
            <span>No published posts.</span>
          )}
          {filter === 'all' && (
            <span>
              No stories yet. Click <span className="font-semibold">Add New Blog</span> to
              create your first post.
            </span>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {filteredPinned.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              saving={saving}
              onEdit={onEditStory}
              onDelete={onDeleteStory}
              onPinToggle={onPinToggle}
            />
          ))}
          {filteredOthers.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              saving={saving}
              onEdit={onEditStory}
              onDelete={onDeleteStory}
              onPinToggle={onPinToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
})

