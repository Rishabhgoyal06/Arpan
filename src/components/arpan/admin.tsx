import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldCheck, FileText, Search, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useArpan } from '@/lib/arpan/state';
import { useAuditLogs, useRecordAuditAction, useUsersForAdmin, useReports, useVerifyEntry } from '@/lib/arpan/queries';
import { PageHeading } from './shared';

const pages = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/needs', label: 'Need verification' },
  { to: '/admin/institutions', label: 'Institutions' },
  { to: '/admin/seva', label: 'Seva moderation' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/content', label: 'Content' },
] as const;

export function AdminPage({ section = 'Overview' }: { section?: string }) {
  const { entries } = useArpan();
  const { data: persistentAudit = [] } = useAuditLogs();
  const { data: adminUsers = [] } = useUsersForAdmin();
  const { data: adminReports = [] } = useReports();
  const recordAuditMutation = useRecordAuditAction();
  const verifyMutation = useVerifyEntry();

  const [search, setSearch] = useState('');
  const [review, setReview] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [audit, setAudit] = useState<string[]>([]);

  const rows =
    section === 'Users'
      ? adminUsers.map((u: any) => ({
          id: u.id,
          title: `${u.display_name || 'Community Member'}${u.location ? ` · ${u.location}` : ''}`,
          category: u.is_admin ? 'Admin' : 'Community member',
          date: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recent',
        }))
      : section === 'Reports'
      ? adminReports.map((r: any) => ({
          id: r.id,
          title: `${r.reason}${r.details ? `: ${r.details}` : ''}`,
          category: r.target_type || 'Safety',
          date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent',
        }))
      : entries
          .filter((e) =>
            section === 'Institutions'
              ? e.kind === 'institutions'
              : section === 'Seva moderation'
              ? e.kind === 'seva'
              : section === 'Content'
              ? e.kind === 'offers'
              : section === 'Need verification'
              ? e.kind === 'needs'
              : true
          )
          .map((e) => ({
            id: e.id,
            kind: e.kind,
            title: e.title,
            category: e.category,
            date: e.date || 'Recent',
          }));

  const allAuditLogs = [...audit, ...persistentAudit];

  const pendingNeeds = entries.filter((e) => e.kind === 'needs' && !e.verified).length;
  const activeInstitutions = entries.filter((e) => e.kind === 'institutions').length;
  const activeSevas = entries.filter((e) => e.kind === 'seva').length;
  const activeOffers = entries.filter((e) => e.kind === 'offers').length;

  const healthMetrics = [
    ['Requests awaiting review', String(pendingNeeds)],
    ['Active institutions', String(activeInstitutions)],
    ['Active Sevas', String(activeSevas)],
    ['Community offers', String(activeOffers)],
  ];

  return (
    <div className="page-container">
      <PageHeading
        eyebrow="COMMUNITY MODERATION WORKSPACE"
        title={section === 'Overview' ? 'Care for the community.' : section}
        description="A community review and moderation workspace. Dedicated to privacy, safety and dignity."
      />

      <nav className="admin-tabs">
        {pages.map((p) => (
          <Link className={section === p.label ? 'active' : ''} to={p.to} key={p.to}>
            {p.label}
          </Link>
        ))}
      </nav>

      {section === 'Overview' && (
        <div className="admin-health">
          {healthMetrics.map(([t, v]) => (
            <article key={t}>
              <ShieldCheck />
              <strong>{v}</strong>
              <p>{t}</p>
            </article>
          ))}
        </div>
      )}

      <label className="search-field admin-search">
        <Search size={18} />
        <input
          placeholder="Search review queue…"
          aria-label="Search review queue"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{section === 'Users' ? 'Community member' : 'Request / content'}</th>
              <th>Category</th>
              <th>Status</th>
              <th>Reviewer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
              .map((e) => (
                <tr key={e.id}>
                  <td>
                    <strong>{e.title}</strong>
                    <small>{e.date}</small>
                  </td>
                  <td>{e.category}</td>
                  <td>
                    <span className="review-status">{statuses[e.id] ?? 'Awaiting review'}</span>
                  </td>
                  <td>{statuses[e.id] ? 'Community reviewer' : 'Unassigned'}</td>
                  <td>
                    <Button variant="outline" onClick={() => setReview(e.id)}>
                      Review <ArrowUpRight />
                    </Button>
                  </td>
                </tr>
              ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No records awaiting moderation in this queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {allAuditLogs.length > 0 && (
        <section className="audit-log">
          <h3>Audit log</h3>
          {allAuditLogs.map((a, i) => (
            <p key={i}>
              {typeof a === 'string'
                ? a
                : `[${a.created_at ? new Date(a.created_at).toLocaleTimeString() : 'Recent'}] ${a.action} on ${a.target_type} ${a.target_id || ''}`}
            </p>
          ))}
        </section>
      )}

      <Dialog
        open={Boolean(review)}
        onOpenChange={(open) => {
          if (!open) setReview(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Review with care</DialogTitle>
          <DialogDescription>Dignity-first moderation record.</DialogDescription>
          <h3>{rows.find((e) => e.id === review)?.title}</h3>
          <div className="document-preview">
            <FileText />
            <span>
              Verification assessment record
              <br />
              <small>Sensitive identity and personal contact details remain private.</small>
            </span>
          </div>
          <label>
            Verification notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Consent, dignity and safety observations…"
              rows={4}
            />
          </label>
          <div className="flow-actions">
            {['Request information', 'Verified', 'Needs attention'].map((status) => (
              <Button
                key={status}
                variant={status === 'Verified' ? 'default' : 'outline'}
                onClick={() => {
                  if (review) {
                    setStatuses((s) => ({ ...s, [review]: status }));
                    setAudit((a) => [
                      `${status} · Moderator · ${new Date().toLocaleTimeString()} · ${notes || 'No additional notes'}`,
                      ...a,
                    ]);
                    recordAuditMutation.mutate({ action: `${status} for ${review}`, notes });
                    if (status === 'Verified') {
                      const reviewedEntry = rows.find(r => r.id === review);
                      if (reviewedEntry && reviewedEntry.kind) {
                        verifyMutation.mutate({ id: review, kind: reviewedEntry.kind });
                      }
                    }
                  }
                  setReview(null);
                  setNotes('');
                }}
              >
                {status}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


