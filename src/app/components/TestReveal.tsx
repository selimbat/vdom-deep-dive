import { VDOMNode } from "lib/types/vdom"
import { Component } from "../../lib/component"


const CODE_SLIDE_1_1 = `
@explore_blueprint.route(
    "/dashboard/dashboard_key/chart/chart_key/comments",
    methods=["POST"]
)
def dashboard_chart_comments(dashboard_key, chart_key):
    # Get the dashboard
    dashboard = ...
    chart = ...
    # parse data and create comment
    comment = ...

    return success(message=_("Comment successfully added"))
`
const CODE_SLIDE_1_2 = `
@explore_blueprint.route(
    "/dashboard/dashboard_key/chart/chart_key/comments",
    methods=["POST"]
)
def dashboard_chart_comments(dashboard_key, chart_key):
    # Get the dashboard
    dashboard = ...
    chart = ...
    # parse data and create comment
    comment = ...

    # If everything goes well
    dashboard.notify('dashboard_chart_comment_post', current_user_id)

    return success(message=_("Comment successfully added"))
`

export default class TestReveal extends Component<{}> {

    public initProps(props: {}): VDOMNode {
        requestAnimationFrame(() => {
            // Also available as an ES module, see:
            // https://revealjs.com/initialization/
            Reveal.initialize({
                controls: true,
                progress: true,
                center: true,
                hash: true,

                // Learn about plugins: https://revealjs.com/plugins/
                plugins: [RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight]
            });
        })
        return super.initProps(props);
    }

    render() {
        return (
            <div className="reveal" key="root">
                <div className="slides">
                    <section>
                        <h2>Technical specifications - Notification System</h2>
                        <p>By Rodolphe & Selim</p>
                        <br /><br /><br />
                        <figure style="font-size:large;">
                            <blockquote>
                                <p>Why bother with tools when you can do it with Javascript?</p>
                            </blockquote>
                            <figcaption>—Karl Marx, <cite><em>Everything JS</em></cite></figcaption>
                        </figure>
                    </section>
                    <section>
                        <section data-auto-animate>
                            <h2 data-id="code-title">So easy</h2>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-number>
                                {CODE_SLIDE_1_1}
                            </code></pre>
                        </section>

                        <section data-auto-animate>
                            <h2 data-id="code-title">So easy</h2>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-number>
                                {CODE_SLIDE_1_2}
                            </code></pre>
                        </section>
                    </section>
                    <section>
                        <section>
                            <h2>Terminology</h2>
                        </section>
                        <section>
                            <h3>Actor</h3>
                            <p>The actor is the user who is responsible for triggering a notification.</p>
                        </section>
                        <section>
                            <h3>Notifier</h3>
                            <p>Notifier is the user to whom the notification has to be sent.</p>
                        </section>
                        <section>
                            <h3>Entity</h3>
                            <p>The model responsible for the notification.</p>
                        </section>
                        <section>
                            <h3>Action type</h3>
                            <p>A key that represents a type of notification. It is used to find the right text to display to the
                                user.</p>
                        </section>
                        <section>
                            <p><span className="r-frame">Alice</span> commented on <span className="r-frame">Bob</span>'s <span
                                className="r-frame">dashboard</span>.</p>
                            <p className="fragment">Actor: Alice</p>
                            <p className="fragment">Notifier: Bob</p>
                            <p className="fragment">Entity: Dashboard</p>
                            <p className="fragment">Action type: <code>dashboard_comment_post</code></p>
                        </section>
                    </section>

                    <section>
                        <section>
                            <h2>Models</h2>
                        </section>
                        <section><img className="r-stretch" src="./assets/notif-diagram.svg" alt="" /></section>
                    </section>

                    <section>
                        <section>
                            <h2>Some OOP</h2>
                        </section>
                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers="1-16|2-3|5|7-8|10-11|13-14|16">
                                class NotifyingEntity:
                                @abstract
                                def get_id_for_notification(self):

                                def notify(self, action_type, actor_id, old_entity=None):

                                @abstract
                                def get_notifiers(self, action_type, actor_id, old_entity=None) -{">"} List[User["id"]]:

                                # Should maybe be abstract?
                                def delete_unread_notifications(self, action_type, actor_id, old_entity=None)

                                @abstract
                                def get_notifiers_to_delete(self, action_type, actor_id, old_entity=None) -{">"} List[User['id']]:

                                def get_notifications(self, notifier_id=None) -{">"} List[Notification]:
                            </code></pre>
                        </section>
                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers="5-26">
                                class NotifyingEntity:
                                @abstract
                                def get_id_for_notification(self):

                                def notify(self, action_type, actor_id, old_entity=None):
                                source = NotificationSource(
                                entity_type=self.__class__.__tablename__,
                                entity_id=self.get_id_for_notification(),
                                action_type=action_type,
                                actor_id=actor_id,
                                )
                                session.add(source)
                                notifiers = self.get_notifiers(action_type, actor_id, old_entity):

                                # On ne s'envoie pas de notif à sois-même
                                notifiers = [id for id in notifiers if id != actor_id]

                                notifications = [
                                Notification(
                                notifier_id=id,
                                notification_source=source
                                )
                                for id in notifiers]
                                session.add(**notifications)
                                session.commit()

                                @abstract
                                def get_notifiers(self, action_type, actor_id, old_entity=None) -{">"} List[User["id"]]:

                                # Should maybe be abstract?
                                def delete_unread_notifications(self, action_type, actor_id, old_entity=None)

                                @abstract
                                def get_notifiers_to_delete(self, action_type, actor_id, old_entity=None) -{">"} List[User['id']]:

                                def get_notifications(self, notifier_id=None) -{">"} List[Notification]:
                            </code></pre>
                        </section>
                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers="11-21">
                                class NotifyingEntity:
                                @abstract
                                def get_id_for_notification(self):

                                def notify(self, action_type, actor_id, old_entity=None):

                                @abstract
                                def get_notifiers(self, action_type, actor_id, old_entity=None) -{">"} List[User["id"]]:

                                # Should maybe be abstract?
                                def delete_unread_notifications(self, action_type, actor_id, old_entity=None):
                                to_delete = self.get_notifiers_to_delete(action_type, actor_id, old_entity)
                                notifications = session.query(Notification).join(NotificationSource) \
                                .filter(Notification.read is False) \
                                .filter(Notification.notifier_id.in_(to_delete)) \
                                .filter(NotificationSource.entity_type == self.__class__.__tablename__) \
                                .filter(NotificationSource.entity_id == self.get_id_for_notification()) \
                                .filter(NotificationSource.action_type == action_type) \
                                .filter(NotificationSource.actor_id == actor_id) # Not sure about this
                                # delete les notifs
                                # Question: better to delete or flag as obsolete?

                                @abstract
                                def get_notifiers_to_delete(self, action_type, actor_id, old_entity=None) -{">"} List[User['id']]:

                                def get_notifications(self, notifier_id=None) -{">"} List[Notification]:
                            </code></pre>
                        </section>
                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers="16-17">
                                class NotifyingEntity:
                                @abstract
                                def get_id_for_notification(self):

                                def notify(self, action_type, actor_id, old_entity=None):

                                @abstract
                                def get_notifiers(self, action_type, actor_id, old_entity=None) -{">"} List[User["id"]]:

                                # Should maybe be abstract?
                                def delete_unread_notifications(self, action_type, actor_id, old_entity=None):

                                @abstract
                                def get_notifiers_to_delete(self, action_type, actor_id, old_entity=None) -{">"} List[User['id']]:

                                def get_notifications(self, notifier_id=None) -{">"} List[Notification]:
                                # TODO
                            </code></pre>
                        </section>
                    </section>

                    <section data-auto-animate>
                        <section>
                            <h2>Back to our example</h2>
                        </section>
                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers="1-13|3-4|6-11|13-14">
                                class Dashboard(NotifyingEntity):
                                #...
                                def get_id_for_notification(self):
                                return self.id

                                def get_notifiers(self, action_type, actor_id, old_entity=None):
                                match action_type:
                                case 'dashboard_chart_comment_post':
                                return [self.owner]
                                case default:
                                raise UnknownActionException()

                                def get_notifiers(self, action_type, actor_id, old_entity=None):
                                return self.get_notifiers(action_type, actor_id, old_entity)
                            </code></pre>
                        </section>

                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-number>
                                @explore_blueprint.route(
                                "/dashboard/dashboard_key/chart/chart_key/comments",
                                methods=["POST"]
                                )
                                def dashboard_chart_comments(dashboard_key, chart_key):
                                # Get the dashboard
                                dashboard = ...
                                chart = ...
                                # parse data and create comment
                                comment = ...

                                # If everything goes well
                                dashboard.notify('dashboard_chart_comment_post', current_user_id)

                                return success(message=_("Comment successfully added"))
                            </code></pre>
                        </section>

                        <section>
                            <h2>If the comment was a mistake</h2>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-number>
                                @explore_blueprint.route(
                                "/dashboard/dashboard_key/chart/chart_key/comment/comment_id",
                                methods=["DELETE"],
                                )
                                def dashboard_chart_comment(dashboard_key, chart_key, comment_id):
                                # Get the dashboard
                                dashboard = ...
                                comment = ...

                                # If everything goes well
                                dashboard.delete_unread_notifications(
                                'dashboard_chart_comment_post',
                                current_user_id
                                )

                                return success(message=_("Comment successfully deleted"))
                            </code></pre>
                        </section>

                    </section>

                    <section data-auto-animate>
                        <section>
                            <h2>A more complicated example</h2>
                        </section>
                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers="1-25|2-5|7-9|11-21|23-25">
                                class NotifyingTextWithMentions(NotifyingEntity):
                                @abstract
                                def get_text_content(self):
                                # Le champ textuel dépend en fait du model, des fois c'est content,
                                # d'autres fois c'est description...

                                @abstract
                                def get_mention_action_types(self):
                                # Retourne les actions concernées par les mentions

                                def get_notifiers(self, action_type, actor_id, old_entity=None):
                                if not self.get_text_content():
                                raise UnspecifiedTextField()

                                if action_type in self.get_mention_action_types():
                                old_tagged_users = parse_tags_from_content(old_entity.get_text_content())
                                new_tagged_users = parse_tags_from_content(self.get_text_content())
                                # fait le diff entre les deux
                                return # ceux qui ont une occurence + haute dans new_tagged_users sont les notifiers, la fonction les renvoie

                                raise UnknownActionException()

                                def get_notifiers_to_delete(self, action_type, actor_id, old_entity=None):
                                # pareil que get_notifiers mais dans l'autre sens. On renvoie ceux qui
                                # ont été supprimé par rajouté
                            </code></pre>
                        </section>

                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers>
                                class InscriptionComment(NotifyingTextWithMentions):
                                ...
                                def get_text_content(self):
                                return self.content

                                def get_mention_action_types(self):
                                return ['inscription_comment_edit', 'inscription_comment_post']
                            </code></pre>
                        </section>
                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers>
                                class EnrichedOperation(NotifyingTextWithMentions):
                                ...
                                def get_text_content(self):
                                return self.description

                                def get_mention_action_types(self):
                                return ['operation_description_edit']
                            </code></pre>
                        </section>
                        <section>
                            <h2>Usage</h2>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers="1-4|6-29">
                                # API POST inscription comment
                                def post_inscription_comment_api(inscription_id):
                                ... # créer le commentaire comme d'habitude
                                comment.notify('inscription_comment_post', current_user_id)

                                # API PATCH inscription comment
                                def patch_inscription_comment_api(inscription_id):
                                comment = ...
                                old_comment = copy(comment)
                                ... # Le patch comme avant

                                # Si tout se passe bien, on notifie les users
                                # Notify newly tagged users
                                comment.notify(
                                'inscription_comment_edit',
                                current_user_id,
                                old_comment
                                )

                                # Delete unread notification for removed tags
                                comment.delete_unread_notifications(
                                'inscription_comment_edit',
                                current_user_id,
                                old_comment
                                )
                                comment.delete_unread_notifications(
                                'inscription_comment_post',
                                current_user_id,
                                old_comment
                                )
                            </code></pre>
                        </section>
                    </section>

                    <section>
                        <section>
                            <h2>Endpoints</h2>
                        </section>
                        <section>
                            <h2>GET</h2>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers>
                                {
                                    `
                                # GET /notifications
                                def get_notifications_api():
                                notifcations = session.query(Notification)
                                .join(NotificationSource)
                                .filter(Notification.notifier_id == current_user_id)
                                .filter(NotificationSource.created_at.gt(now() - NOTIFICATION_FETCH_WINDOW)
                                .order_by(NotificationSource.created_at)

                                # Filter here multiple notifications coming from a single event?
                                # -{">"} Not in this version

                                # use a serializer

                                # payload de type:
                                Array<{
                                    'read': bool,
                                'entity_type': str,
                                'entity_id': str,
                                'entity_label': str, # C'est plus pratique que l'id mais le front peut aussi se débrouiller sans
                                'action_type': str,
                                'actor_id': int,
                                'actor_name': str, # idem que entity_label
                                }>
                                    `
                                }
                            </code></pre>
                        </section>
                        <section>
                            <h2>PATCH</h2>
                            <pre data-id="code-animation"><code className="hljs" data-trim data-line-numbers="1-8|10-18">
                                # PATCH /notification/notification_id/mark_as_read
                                def patch_notification_read(notification_id):
                                # /!\ Check que la notification appartient bien à l'user connecté
                                # On ne doit pas pouvoir marquer en lu les notifs d'un autre user
                                notification = get_or_404(Notification, notification_id)
                                notification.read = data["read"]
                                session.commit()
                                return success('OK')

                                # PATCH /notifications/mark_as_read
                                def bulk_patch_notifications_read():
                                notifications = session.query(Notification)
                                .filter(Notification.notifier_id == current_user_id)
                                .filter(Notification.read is not data["read"])
                                for notif in notifications:
                                notif.read = data["read"]
                                session.commit()
                                return success('OK')
                            </code></pre>
                        </section>
                    </section>

                    <section>
                        <h2>back & front sync</h2>
                        <br />
                        <p>
                            <strong>Explo</strong>: using WebSockets to emit notification data from back to front.
                        </p>
                        <p className="fragment">
                            <strong>Plan B</strong>: <code>useQuery</code> with automatic refresh every 1 or 2 minutes.
                        </p>
                    </section>

                    <section>
                        <section>
                            <h2>Notifications center</h2>
                        </section>
                        <section>
                            <pre data-id="code-animation"><code className="hljs" data-noescape>
                                {`
                                # component.json

                                {
                                    "notification": {
                                        "operation_description_edit": "{{ actorName }} vous a identifié dans
                                &lt;a href='/budget/operation/{{ entityId }}'&gt;l'opération {{ entityLabel }}&lt;/a&gt;",
                                "dashboard_comment_post": "{{ actorName }} a ajouté un commentaire à votre tableau de bord
                                &lt;a href='/dashboard/{{ entityId }}'&gt;tableau de bord {{ entityLabel }}&lt;/a&gt;",
        }
    }
                                        `}
                            </code></pre>
                        </section>
                        <section>
                            <pre data-id="code-animation"><code className="hljs javascript" data-noescape>
                                {`
                                export default function Notifications({items : Array&lt;Notification&gt;}) =&gt; {
                                    const {
                                        mutate: markAllRead,
                                isLoading,
        } = useMarkAllNotificationRead(userId)

                                const {
                                    mutate: markSingleRead,
                                isLoading,
        } = useMarkSingleNotificationRead(userId)

                                return (
                                    &lt;Button label={t('notification.markasread')} onClick={() =& gt; markAllRead()}&gt;
                                &lt;List&gt;
                                {items.map((notif) =& gt; (
                                    &lt;ListItem onClick={() =& gt; markSingleRead(notif.id)}&gt;
                                &lt;Trans Payload&gt; //TODO:redirect ? how?
                                &lt;/ListItem&gt;
                ))}
                                &lt;/List&gt;
        )}
                                    `}
                            </code></pre>
                        </section>
                    </section>

                    <section>
                        <section>
                            <h2>Mentions</h2>
                        </section>
                        <section>
                            <h3>using tiptap</h3>
                            <ul>
                                <li>Build a simple TipTap component with the Mentions plugin for inscription comments.</li>
                                <li>Include the Mentions plugin to the TextEditor component for operation descriptions and
                                    paragraph widgets.</li>
                            </ul>
                        </section>
                    </section>

                    <section>
                        <h2>Questions?</h2>
                    </section>
                </div>

            </div>

        )
    }
}
