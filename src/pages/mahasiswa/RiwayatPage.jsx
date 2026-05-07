import DashboardLayout from '../../components/layout/DashboardLayout'
import Card from '../../components/ui/Card'

function RiwayatPage() {
  return (
    <DashboardLayout title="Riwayat">
      <Card className="p-8">
        <h2 className="text-xl font-extrabold text-textDark">Riwayat Kegiatan</h2>
        <p className="mt-2 text-sm font-semibold text-textMuted">Riwayat kehadiran dan poin TAK akan muncul di sini.</p>
      </Card>
    </DashboardLayout>
  )
}

export default RiwayatPage
