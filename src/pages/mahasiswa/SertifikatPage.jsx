import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'

function SertifikatPage() {
  return (
    <DashboardLayout title="Sertifikat">
      <Card className="p-8">
        <h2 className="text-xl font-extrabold text-textDark">Sertifikat</h2>
        <p className="mt-2 text-sm font-semibold text-textMuted">Sertifikat kegiatan yang sudah selesai akan tersedia di sini.</p>
      </Card>
    </DashboardLayout>
  )
}

export default SertifikatPage
