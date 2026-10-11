import { useState } from "react";
import { Mail, MailOpen, Archive, ArchiveRestore, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useMessages, useMarkAsRead, useArchiveMessage, useUnarchiveMessage } from "@/hooks/use-messages";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NotificationsPage = () => {
  const { isAdmin } = useAdmin();
  const { data: messages = [], isLoading } = useMessages(isAdmin);
  const markAsRead = useMarkAsRead();
  const archiveMessage = useArchiveMessage();
  const unarchiveMessage = useUnarchiveMessage();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showArchived, setShowArchived] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-normal mb-4">Accès non autorisé</h1>
          <Link to="/login">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await archiveMessage.mutateAsync(id);
      toast.success("Message archivé. Suppression dans 3 jours.");
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error("Erreur lors de l'archivage");
    }
  };

  const handleUnarchive = async (id: number) => {
    try {
      await unarchiveMessage.mutateAsync(id);
      toast.success("Message restauré !");
    } catch (error) {
      toast.error("Erreur lors de la restauration");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredMessages = showArchived
    ? messages.filter((m) => m.archived)
    : messages.filter((m) => !m.archived);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-sm text-secondary hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-normal text-primary">
            Messages reçus
          </h1>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              showArchived
                ? "bg-orange-500 text-white"
                : "bg-foreground/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            {showArchived ? "Voir non archivés" : "Voir archivés"}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{showArchived ? "Aucun message archivé." : "Aucun message pour le moment."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.read && !msg.archived) handleMarkAsRead(msg.id);
                  }}
                  className={`p-4 rounded-none border cursor-pointer transition-all ${
                    selectedMessage?.id === msg.id
                      ? "border-border bg-secondary"
                      : msg.read
                      ? "border-border bg-card"
                      : "border-border bg-secondary"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!msg.read && !msg.archived && <div className="w-2 h-2 rounded-full bg-foreground" />}
                        {msg.archived && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                        <span className="font-semibold text-foreground truncate">{msg.name}</span>
                      </div>
                      <p className="text-sm text-[#171717] truncate">{msg.subject || "Sans objet"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(msg.createdAt)}</p>
                    </div>
                    <div className="flex gap-1">
                      {msg.archived ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnarchive(msg.id);
                          }}
                          className="p-1 text-secondary hover:text-green-500 transition-colors"
                          title="Restaurer"
                        >
                          <ArchiveRestore className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(msg.id);
                          }}
                          className="p-1 text-secondary hover:text-orange-500 transition-colors"
                          title="Archiver"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-card border border-border rounded-none p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-normal text-[#171717]">{selectedMessage.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                    </div>
                    <div className="flex gap-2">
                      {selectedMessage.archived ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUnarchive(selectedMessage.id)}
                        >
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Restaurer
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleArchive(selectedMessage.id)}
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archiver
                        </Button>
                      )}
                      <MailOpen className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                  {selectedMessage.subject && (
                    <p className="text-lg font-semibold text-foreground mb-4">{selectedMessage.subject}</p>
                  )}
                  <div className="prose prose-sm max-w-none text-[#171717] whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                  <p className="text-xs text-muted-foreground mt-6">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-none p-12 text-center text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Sélectionnez un message pour le lire</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
