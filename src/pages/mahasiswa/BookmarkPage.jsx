import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'

function BookmarkPage() {
  return (
    <DashboardLayout title="Bookmark">
      <Card className="p-8">
        <h2 className="text-xl font-extrabold text-textDark">Bookmark Kegiatan</h2>
        <p className="mt-2 text-sm font-semibold text-textMuted">Belum ada kegiatan yang disimpan.</p>
      </Card>
    </DashboardLayout>
  )
}

export default BookmarkPage
