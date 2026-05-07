import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'

function PendaftaranPage() {
  return (
    <DashboardLayout title="Pendaftaran Saya">
      <Card className="p-8">
        <h2 className="text-xl font-extrabold text-textDark">Pendaftaran Saya</h2>
        <p className="mt-2 text-sm font-semibold text-textMuted">Daftar kegiatan yang kamu ikuti akan tampil di sini.</p>
      </Card>
    </DashboardLayout>
  )
}

export default PendaftaranPage
