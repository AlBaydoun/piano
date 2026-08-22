/**
 * Deutscher Kurstext. Die Schlüssel sind Lektions-IDs; das `steps`-Array läuft
 * parallel zu den Schritten in `src/data/lessons.js`.
 */

export default {
  // == Abschnitt 1: bevor Sie spielen =======================================

  'f-instrument': {
    title: 'Was ein Klavier eigentlich tut',
    summary: 'Hämmer, Saiten und das Einzige, was Ihre Finger steuern.',
    steps: [
      {
        title: 'Eine Maschine, die Saiten anschlägt',
        body: [
          'Wenn Sie eine Taste drücken, drücken Sie nicht auf eine Saite. Sie lösen einen kleinen Hebel aus, der einen Filzhammer gegen die Saite wirft — und ihn sofort wieder zurückfallen lässt, damit die Saite frei klingen kann.',
          'Diese Mechanik bestimmt das ganze Verhalten des Instruments. Sobald der Hammer weg ist, haben Sie keinen Einfluss mehr auf den Ton. Sie können ihn nicht anschwellen lassen, nicht ziehen, kein Vibrato hinzufügen wie eine Sängerin oder ein Geiger. Sie bekommen nur **die Geschwindigkeit des Hammers** und **den Moment, in dem Sie loslassen**.',
          'Das klingt nach einer Einschränkung. In Wahrheit ist genau darin die ganze Kunst: Zwei Pianisten, die dieselben Noten spielen, klingen völlig verschieden, und der einzige Unterschied liegt in Geschwindigkeit und Zeitpunkt.',
        ],
      },
      {
        title: 'Tief und hoch',
        body: [
          'Lange, dicke Saiten schwingen langsam und klingen tief. Kurze, dünne schwingen schnell und klingen hoch. Deshalb hat ein Flügel diese Form — das Gehäuse folgt den Saitenlängen.',
          'Hören Sie drei Töne vom unteren, mittleren und oberen Ende der Klaviatur. Achten Sie darauf, wie viel länger der tiefe nachklingt.',
        ],
      },
      {
        title: 'Schnelle Taste, lauter Ton',
        body: [
          'Hier ist dieselbe Taste, einmal langsam und einmal schnell angeschlagen. Sonst hat sich nichts geändert — weder der Druck danach noch die Haltedauer.',
          'Das ist die einzige Lautstärkeregelung, die Ihre Finger haben. Es lohnt sich, früh neugierig darauf zu werden.',
        ],
      },
      {
        question: 'Was können Sie an einem Ton noch ändern, nachdem Sie die Taste gedrückt haben?',
        options: [
          'Die Tonhöhe, durch stärkeren Druck',
          'Wann er aufhört — durch Loslassen der Taste',
          'Die Lautstärke, durch stärkeren Druck',
          'Überhaupt nichts',
        ],
        explain: 'Zusätzlicher Druck nach dem Hammerschlag bewirkt nichts. Das Loslassen der Taste setzt den Dämpfer auf die Saite und beendet den Ton — die Länge liegt also weiterhin bei Ihnen.',
      },
    ],
  },

  'f-posture': {
    title: 'Sitzen und die Hand formen',
    summary: 'Höhe, Abstand und die Handform, auf der alles Weitere aufbaut.',
    steps: [
      {
        title: 'Höhe und Abstand',
        body: [
          'Sitzen Sie so, dass Ihre Unterarme etwa **auf Höhe der Tasten** liegen — eine waagerechte Linie vom Ellenbogen zum Knöchel. Müssen die Handgelenke nach oben greifen, ist die Bank zu niedrig; hängen sie herab, ist sie zu hoch.',
          'Sitzen Sie auf der vorderen Hälfte der Bank, weit genug hinten, dass die Ellenbogen leicht vor dem Körper sind und Sie sich vorbeugen können, ohne einzusacken. Füße flach auf dem Boden. Reichen die Füße nicht hin, legen Sie ein Buch darunter: Sie stützen sich stärker auf den Boden, als Sie denken.',
          'Richten Sie sich auf {note:D4} aus — etwa die Mitte der Klaviatur, nicht die Mitte des Gehäuses.',
        ],
      },
      {
        title: 'Die Handform',
        body: [
          'Lassen Sie den Arm locker herabhängen. Achten Sie auf die Form, die die Hand von selbst annimmt: Finger sanft gerundet, Daumen entspannt, nichts gestreckt und nichts verkrampft.',
          'Heben Sie sie nun zu den Tasten, **ohne diese Form zu verändern**. Das ist die Haltung. Gespielt wird auf den Fingerkuppen, und das letzte Gelenk muss fest genug sein, um nicht einzuknicken.',
          'Achten Sie auf zwei Dinge. Sackt der Grundknöchel eines Fingers nach innen, hat der Finger keine Stütze. Fällt das Handgelenk unter die Tastenhöhe, verlieren Sie den Arm hinter dem Klang. Beides ist kein Drama — kurz zurücksetzen und weitermachen.',
        ],
      },
      {
        title: 'Ein Ton, aber richtig',
        body: [
          'Spielen Sie {note:C4} einmal mit dem dritten Finger der rechten Hand. Zielen Sie auf einen leichten, vollen Klang statt auf Lautstärke, und lassen Sie die Taste ganz zurückkommen, bevor Sie die Hand heben.',
        ],
        prompt: 'Spielen Sie {note:C4}',
      },
      {
        question: 'Ihre Handgelenke müssen nach oben greifen, um die Tasten zu erreichen. Was stimmt nicht?',
        options: ['Sie sitzen zu nah', 'Ihre Finger sind zu stark gerundet', 'Die Bank ist zu niedrig', 'Sie sitzen zu weit weg'],
        explain: 'Die Unterarme sollten etwa waagerecht in die Klaviatur laufen. Ein Winkel nach oben heißt: Bank höher stellen.',
      },
    ],
  },

  'f-black-keys': {
    title: 'Das Muster der schwarzen Tasten',
    summary: 'Schwarze Tasten kommen in Zweier- und Dreiergruppen. Dieses Muster ist Ihre Landkarte.',
    steps: [
      {
        title: 'Ein sich wiederholendes Muster',
        body: [
          'Ein Klavier sieht nach sehr vielen Tasten aus, ist aber in Wahrheit ein kleines Muster, das sich immer wiederholt.',
          'Sehen Sie sich die schwarzen Tasten an. Sie wechseln zwischen einer Gruppe aus **zwei** und einer aus **drei**. Dieses Muster zieht sich über die ganze Klaviatur, und jede weiße Taste bekommt ihren Namen aus ihrer Lage zu diesen Gruppen.',
          'Sobald Sie die Gruppen sehen, müssen Sie nie wieder Tasten vom Rand her abzählen.',
        ],
      },
      {
        title: '{note:C} finden',
        body: ['**{note:C} ist die weiße Taste unmittelbar links von jeder Zweiergruppe.** Suchen Sie irgendeine und spielen Sie sie.'],
        prompt: 'Spielen Sie ein beliebiges {note:C}',
      },
      {
        title: '{note:F} finden',
        body: ['**{note:F} ist die weiße Taste unmittelbar links von jeder Dreiergruppe.** Spielen Sie ein beliebiges {note:F}.'],
        prompt: 'Spielen Sie ein beliebiges {note:F}',
      },
      {
        question: 'Welche weiße Taste liegt zwischen den beiden schwarzen einer Zweiergruppe?',
        options: ['{note:C}', '{note:D}', '{note:E}', '{note:G}'],
        explain: '{note:C} steht links von der Gruppe, {note:D} in der Mitte, {note:E} rechts. Diese drei umschließen immer eine Zweiergruppe.',
      },
    ],
  },

  'f-white-keys': {
    title: 'Die weißen Tasten benennen',
    summary: 'Sieben Namen, dann wieder von vorn — und wie man sagt, welchen man meint.',
    steps: [
      {
        title: 'Sieben Namen, immer wieder',
        body: [
          'Die weißen Tasten tragen sieben Namen, und nach dem siebten beginnt alles von vorn. Im Deutschen sind das **C D E F G A H**; im Englischen heißt der siebte B; in weiten Teilen der Welt benutzt man die Silben Do Re Mi. Gemeint sind dieselben Tasten.',
          'Weil sich das Muster der schwarzen Tasten alle sieben weißen wiederholt, passen die Namen genau darauf. {note:C} steht immer links von einer Zweiergruppe, {note:F} links von einer Dreiergruppe.',
          'Der Abstand von einem {note:C} zum nächsten heißt **Oktave**.',
        ],
      },
      { title: '{note:G} finden', body: ['{note:G} liegt zwischen der zweiten und dritten schwarzen Taste einer Dreiergruppe.'], prompt: 'Spielen Sie ein beliebiges {note:G}' },
      { title: '{note:A} finden', body: ['{note:A} ist die nächste weiße Taste über {note:G}.'], prompt: 'Spielen Sie ein beliebiges {note:A}' },
      { title: '{note:B} finden', body: ['{note:B} ist die weiße Taste unmittelbar **rechts** von einer Dreiergruppe — und die direkt unter {note:C}.'], prompt: 'Spielen Sie ein beliebiges {note:B}' },
      {
        title: 'Aber welches?',
        body: [
          'Auf einer vollen Klaviatur gibt es sieben oder acht {note:C}, „spielen Sie ein {note:C}“ ist also mehrdeutig. Musiker nummerieren die Oktaven: Das {note:C} nahe der Mitte der Klaviatur heißt **{note:C4}**, meist eingestrichenes {note:C} genannt.',
          'Die Nummer wechselt beim {note:C}, nicht beim {note:A}. {note:B3} und {note:C4} sind also Nachbarn, und der Ton direkt über {note:B3} ist {note:C4}.',
        ],
      },
      {
        title: 'Eine Oktave höher',
        body: ['Spielen Sie {note:C4}, dann {note:C5} — das nächste {note:C} darüber. Derselbe Name, die doppelte Frequenz.'],
        prompt: 'Spielen Sie {note:C4}, dann {note:C5}',
      },
      {
        question: 'Welcher Ton liegt eine weiße Taste **unter** {note:C4}?',
        options: ['{note:B4}', '{note:B3}', '{note:D4}', '{note:C3}'],
        explain: 'Die Oktavzahl wechselt beim {note:C}, also ist die weiße Taste unter {note:C4} das {note:B3}.',
      },
    ],
  },

  // == Abschnitt 2: erster Kontakt ==========================================

  'fc-fingers': {
    title: 'Fingersatzzahlen',
    summary: 'Der Daumen ist die 1. In beiden Händen. Immer.',
    steps: [
      {
        title: 'Die Nummerierung',
        body: [
          'Klaviernoten bezeichnen die Finger mit **1 bis 5**, beginnend beim Daumen: Daumen 1, Zeigefinger 2, Mittelfinger 3, Ringfinger 4, kleiner Finger 5. Das gilt für beide Hände, die beiden Einsen sind also die beiden Daumen, die aufeinander zeigen.',
          'Gitarristen und Streicher zählen anders, was oft für Verwirrung sorgt. Am Klavier ist der Daumen immer die 1.',
          'Ein in die Noten geschriebener Fingersatz ist keine Verzierung. Meist entscheidet er darüber, ob eine Stelle gelingt oder ob sich die Hand drei Takte später verknotet.',
        ],
      },
      {
        title: 'Aufwärts mit der rechten Hand',
        body: ['Setzen Sie den Daumen der **rechten** Hand auf {note:C4}, die übrigen Finger fallen auf die nächsten vier weißen Tasten. Spielen Sie alle fünf aufwärts, ein Finger pro Taste.'],
        prompt: 'Spielen Sie {note:C} {note:D} {note:E} {note:F} {note:G} mit den Fingern 1 2 3 4 5',
      },
      {
        title: 'Und wieder abwärts',
        body: ['Jetzt abwärts, 5 4 3 2 1. Halten Sie die Töne gleichmäßig — gleiche Lautstärke, gleiche Abstände. Gleichmäßigkeit ist schwerer als Schnelligkeit und wichtiger.'],
        prompt: 'Spielen Sie {note:G} {note:F} {note:E} {note:D} {note:C}',
      },
      {
        question: 'Welcher Finger ist im Klavierfingersatz die Nummer 1?',
        options: ['Der Daumen', 'Der Zeigefinger', 'Der kleine Finger', 'Das hängt von der Hand ab'],
        explain: 'Der Daumen ist in beiden Händen die 1, deshalb spiegeln sich die Zahlen über die Klaviatur hinweg.',
      },
    ],
  },

  'fc-five-finger': {
    title: 'Die Fünftonlage',
    summary: 'Fünf Tasten unter fünf Fingern, und nichts muss sich bewegen.',
    steps: [
      {
        title: 'Ein fester Standpunkt',
        body: [
          'Liegt der rechte Daumen auf {note:C4}, befinden sich fünf weiße Tasten unter fünf Fingern. Alles in diesem Abschnitt spielt sich innerhalb dieser Form ab, Sie können also aufhören, auf die Hand zu schauen, und anfangen zuzuhören.',
          'Die linke Hand macht dasselbe eine oder zwei Oktaven tiefer, aber mit dem **kleinen Finger** auf dem unteren {note:C} — die Hände sind Spiegelbilder, links läuft es also aufwärts 5 4 3 2 1.',
          'Lassen Sie die Finger, die gerade nicht spielen, leicht auf ihren Tasten liegen. Sie in die Luft zu heben ist überflüssige Bewegung und ermüdet die Hand.',
        ],
      },
      {
        title: 'Sprünge in der Lage',
        body: ['Spielen Sie diese sechs Töne. Sie bleiben in der Lage, springen aber herum, sodass Sie in Fingern denken müssen statt in einer Tonleiter.'],
        prompt: 'Spielen Sie die Töne der Reihe nach',
      },
      {
        title: 'Dasselbe mit links',
        body: ['Nun das Spiegelbild eine Oktave tiefer, mit der linken Hand. Kleiner Finger auf {note:C3}.'],
        prompt: 'Spielen Sie die Töne mit der linken Hand',
      },
      {
        title: 'Im Takt',
        body: ['Starten Sie das Metronom und spielen Sie auf jeden Klick einen beliebigen Ton der Lage. Langsam ist schwerer als schnell — widerstehen Sie dem Drang zu hetzen.'],
        prompt: 'Spielen Sie eine Note pro Klick',
      },
    ],
  },

  'fc-mary': {
    title: 'Ihre erste Melodie',
    summary: 'Drei Töne, keine Handbewegung, eine Melodie, die jeder kennt.',
    steps: [
      {
        title: 'Mit drei Tönen anfangen',
        body: [
          '„Mary Had a Little Lamb“ braucht nur {note:C}, {note:D} und {note:E} — die Finger 1, 2 und 3 — dazu ein {note:G} gegen Ende.',
          'Stellen Sie sich in die Fünftonlage und lassen Sie die Hand dort. Jeder Ton liegt bereits unter einem Finger, es geht nur noch darum, den richtigen zu wählen.',
          'Sprechen Sie die Fingerzahlen laut mit. Es fühlt sich albern an und es wirkt.',
        ],
      },
      { title: 'Erste Phrase', body: ['{note:E} {note:D} {note:C} {note:D} — Finger 3 2 1 2.'], prompt: 'Spielen Sie {note:E} {note:D} {note:C} {note:D}' },
      { title: 'Zweite Phrase', body: ['Dreimal {note:E}, dann dreimal {note:D}. Derselbe Finger dreimal hintereinander — halten Sie die Töne gleich.'], prompt: 'Spielen Sie {note:E} {note:E} {note:E} {note:D} {note:D} {note:D}' },
      { title: 'Der Griff zum {note:G}', body: ['{note:E}, dann {note:G} mit dem fünften Finger, und noch einmal {note:G}.'], prompt: 'Spielen Sie {note:E} {note:G} {note:G}' },
      { title: 'Ganz durchspielen', body: ['Öffnen Sie das Stück und spielen Sie es mit der rechten Hand allein in bequemem Tempo. Im Wartemodus hält jede Note, bis Sie sie finden.'] },
    ],
  },

  'fc-twinkle': {
    title: 'Morgen kommt der Weihnachtsmann',
    summary: 'Ein Griff über fünf Töne und Ihr erstes wiederkehrendes Muster.',
    steps: [
      {
        title: 'Das Muster erkennen',
        body: [
          'Die Melodie besteht aus drei Phrasen, und die dritte ist einfach die zweite noch einmal. Musik steckt voller Wiederholungen — sie zu bemerken heißt, ein Stück in einem Drittel der Zeit zu lernen.',
          'Sehen Sie ein Stück auf Wiederholungen durch, bevor Sie den ersten Ton spielen. Das ist die wertvollste Gewohnheit im ganzen Kurs.',
        ],
      },
      { title: 'Der Sprung am Anfang', body: ['{note:C} {note:C} {note:G} {note:G} — Daumen, Daumen, kleiner Finger, kleiner Finger.'], prompt: 'Spielen Sie {note:C} {note:C} {note:G} {note:G}' },
      { title: 'Abwärts', body: ['{note:A} {note:A} {note:G}. Das {note:A} liegt eine Taste außerhalb der Lage — strecken Sie den fünften Finger oder verschieben Sie die Hand leicht, beides ist in Ordnung.'], prompt: 'Spielen Sie {note:A} {note:A} {note:G}' },
      { title: 'Der Abstieg', body: ['{note:F} {note:F} {note:E} {note:E} {note:D} {note:D} {note:C} — ein glatter Weg nach unten.'], prompt: 'Spielen Sie den Abstieg' },
      { title: 'Ganz durchspielen', body: ['Versuchen Sie das ganze Stück. Wirkt die linke Hand einschüchternd, stellen Sie „Hände“ auf „nur rechts“ — den Rest übernimmt das Programm.'] },
    ],
  },

  // == Abschnitt 3: Rhythmus ================================================

  'r-pulse': {
    title: 'Der Puls',
    summary: 'Das Gleichmäßige, das unter allem anderen liegt.',
    steps: [
      {
        title: 'Der Schlag ist nicht der Rhythmus',
        body: [
          'Unter jedem Musikstück liegt ein gleichmäßiger Puls — das, wozu Sie mit dem Fuß wippen. Er wird nicht schneller, wenn viele Noten kommen, und nicht langsamer, wenn es dünner wird. Er läuft einfach weiter.',
          'Der **Rhythmus** ist das Muster der Töne über diesem Puls. Beides zu verwechseln ist der häufigste Grund, warum ein Stück auseinanderfällt: Die leichten Takte werden gehetzt, die schweren geschleppt, und der Puls verschwindet.',
          'Ein Metronom ist kein strenger Aufseher. Es ist ein zweites Paar Ohren, das Sie nie belügt.',
        ],
      },
      { title: 'Langsamer Puls', body: ['Sechzig Schläge pro Minute — einer pro Sekunde. Spielen Sie achtmal einen beliebigen Ton genau auf den Klick.'], prompt: 'Spielen Sie eine Note pro Klick' },
      { title: 'Schnellerer Puls', body: ['Jetzt dasselbe bei 96. Die Töne kommen früher, die Aufgabe bleibt: mit dem Klick landen, nicht knapp danach.'], prompt: 'Spielen Sie eine Note pro Klick' },
      {
        question: 'Eine Stelle wird technisch schwerer. Was soll mit dem Puls geschehen?',
        options: ['Er wird von selbst langsamer', 'Er wird vor Aufregung schneller', 'Er bleibt genau gleich', 'Er wartet, bis Sie bereit sind'],
        explain: 'Der Puls ist konstant. Lässt sich eine Stelle im Tempo nicht spielen, muss das ganze Stück langsamer geübt werden — nicht nur die schwere Stelle.',
      },
    ],
  },

  'r-note-values': {
    title: 'Notenwerte',
    summary: 'Ganze, halbe, Viertel, Achtel — jede halb so lang wie die vorige.',
    steps: [
      {
        title: 'Immer weiter halbieren',
        body: [
          'Der Rhythmus in Noten beruht auf fortgesetztem Halbieren. Eine **ganze Note** dauert vier Schläge. Eine **halbe** zwei. Eine **Viertelnote** einen Schlag. Eine **Achtelnote** einen halben.',
          'Man sieht es an der Schreibweise. Die ganze Note ist ein leerer Kopf ohne Hals. Mit Hals wird sie zur halben. Füllt man den Kopf aus, ist es eine Viertel. Kommt ein Fähnchen dazu, eine Achtel.',
          'Zählen Sie beim Lernen laut mit. Nicht innerlich — laut. Das ist der Unterschied zwischen „den Rhythmus kennen“ und ihn spielen zu können.',
        ],
      },
      {
        question: 'Wie viele Achtelnoten passen in eine halbe Note?',
        options: ['Zwei', 'Drei', 'Vier', 'Acht'],
        explain: 'Eine halbe Note sind zwei Schläge, und jeder Schlag fasst zwei Achtel — also vier.',
      },
      { title: 'In Vierern zählen', body: ['Lassen Sie das Metronom laufen und zählen Sie laut „eins zwei drei vier“ mit. Spielen Sie auf die Eins jeder Vierergruppe und schweigen Sie auf 2, 3 und 4.'], prompt: 'Spielen Sie auf den ersten Schlag jedes Takts' },
      {
        question: 'Ein Ton dauert im 4/4-Takt zwei Schläge. Was ist er?',
        options: ['Eine ganze Note', 'Eine halbe Note', 'Eine Viertelnote', 'Eine Achtelnote'],
        explain: 'Die ganze Note füllt alle vier Schläge; halbiert ergibt sie die zweischlägige halbe Note.',
      },
    ],
  },

  'r-rests': {
    title: 'Pausen',
    summary: 'Auch Stille wird notiert, und ebenso genau abgemessen.',
    steps: [
      {
        title: 'Gezählte Stille',
        body: [
          'Zu jedem Notenwert gehört eine **Pause** — ein Zeichen, das heißt: „hier klingt genau so lange nichts“. Eine Viertelpause ist ein Schlag Stille, eine Achtelpause ein halber.',
          'Anfänger behandeln Pausen gern als optionale Verschnaufer. Das sind sie nicht: Eine Pause ist so genau bemessen wie eine Note, und ein Takt ohne die fehlende Pause geht schlicht nicht auf.',
          'Am Klavier bedeutet eine Pause meist **die Taste loslassen**, nicht nur aufhören zu spielen. Die Stille ist erst echt, wenn der Dämpfer aufliegt.',
        ],
      },
      {
        title: 'Stille hat eine Form',
        body: [
          'In den Pausen lebt die Phrasierung. Der Zwischenraum, bevor eine Phrase neu beginnt, macht sie zu einem neuen Satz statt zu einer Fortsetzung.',
          'Zählen Sie beim Üben die Pausen genauso laut mit wie die Noten. Wenn Sie nach einer Pause ständig zu früh einsetzen, zählen Sie sie mit ziemlicher Sicherheit nicht.',
        ],
      },
      {
        question: 'Ein 4/4-Takt enthält eine halbe Note und eine Viertelnote. Was fehlt?',
        options: ['Nichts, der Takt ist voll', 'Eine halbe Pause', 'Eine Achtelpause', 'Eine Viertelpause'],
        explain: 'Zwei Schläge plus einer sind drei, der Takt braucht aber vier — also ein Schlag Stille, eine Viertelpause.',
      },
    ],
  },

  'r-time-signatures': {
    title: 'Taktarten',
    summary: 'Wie viele Schläge in einem Takt stecken und wie lang ein Schlag ist.',
    steps: [
      {
        title: 'Zwei Zahlen, zwei Fragen',
        body: [
          'Das Zahlenpaar am Anfang eines Stücks ist die **Taktart**. Die obere Zahl sagt, wie viele Schläge ein Takt hat. Die untere, welcher Notenwert einen Schlag zählt: 4 heißt Viertelnote, 8 heißt Achtel.',
          '4/4 sind also vier Viertelschläge pro Takt — die Voreinstellung für den größten Teil von Pop, Rock und Volksmusik, so verbreitet, dass sie manchmal nur als **C** geschrieben wird.',
          'Die senkrechten Striche durch das System sind **Taktstriche**; sie existieren allein, um Schläge zu gruppieren, damit das Auge sich zurechtfindet.',
        ],
      },
      {
        title: 'Drei Schläge statt vier',
        body: [
          'Der 3/4-Takt gibt drei Schläge pro Takt, und diese eine Änderung macht aus einem Marsch einen Walzer. „Stille Nacht“, „Greensleeves“ und das Menuett in Ihrer Sammlung stehen alle im 3/4-Takt.',
          'Der erste Schlag jedes Takts trägt eine natürliche Betonung. Genau diese Betonung, die alle drei statt alle vier Schläge wiederkehrt, macht den ganzen Unterschied.',
        ],
      },
      { title: 'Die Drei spüren', body: ['Das Metronom betont den ersten Schlag jeder Dreiergruppe. Spielen Sie auf jeden Klick einen Ton und spüren Sie, wo die Eins liegt.'], prompt: 'Spielen Sie eine Note pro Klick' },
      {
        question: 'Ein Stück steht im 3/4-Takt. Wie viele Viertelnoten passen in einen Takt?',
        options: ['Zwei', 'Drei', 'Vier', 'Sechs'],
        explain: 'Die obere Zahl 3 heißt drei Schläge pro Takt, die untere 4, dass ein Schlag eine Viertelnote ist.',
      },
      {
        question: 'Was sagt die untere Zahl einer Taktart?',
        options: ['Wie viele Takte das Stück hat', 'Wie schnell zu spielen ist', 'Welcher Notenwert einen Schlag zählt', 'Wie laut zu spielen ist'],
        explain: 'Sie benennt die Schlageinheit: 4 für die Viertel, 8 für die Achtel, 2 für die halbe Note.',
      },
    ],
  },

  'r-dots-ties': {
    title: 'Punkte und Bindebögen',
    summary: 'Zwei Wege, eine Länge zu schreiben, für die es kein eigenes Zeichen gibt.',
    steps: [
      {
        title: 'Ein Punkt verlängert um die Hälfte',
        body: [
          'Ein Punkt hinter einer Note macht sie **um die Hälfte länger**. Eine punktierte halbe Note ist 2 + 1 = drei Schläge. Eine punktierte Viertel ist 1 + ½ = anderthalb Schläge.',
          'Das Muster „punktierte Viertel plus Achtel“ steckt überall: Es ist das lang-kurze Wiegen am Anfang von „Stille Nacht“, „London Bridge“ und der Hälfte aller Volkslieder.',
          'Zählen Sie es als „eins-und-zwei-und“ und setzen Sie die kurze Note auf das zweite „und“. Raten funktioniert hier nie.',
        ],
      },
      { title: 'Lang, kurz', body: ['Spielen Sie diese vier Töne: den ersten anderthalb Schläge halten, den zweiten nur einen halben. Sprechen Sie dabei „EINS und zwei UND“.'], prompt: 'Spielen Sie die vier Töne' },
      {
        title: 'Der Bindebogen',
        body: [
          'Ein **Bindebogen** ist ein Bogen, der zwei Noten gleicher Höhe verbindet. Er heißt: Spielen Sie die erste und halten Sie durch die zweite hindurch — ein Klang von der Länge beider Werte.',
          'Bindebögen gibt es, weil Takte aufgehen müssen. Soll ein Ton über den Taktstrich hinaus klingen, kann man nicht einfach länger schreiben; man schreibt zwei Noten und bindet sie.',
          'Verwechseln Sie ihn nicht mit dem **Legatobogen**, der gleich aussieht, aber *verschiedene* Tonhöhen verbindet und „gebunden spielen“ bedeutet. Derselbe Bogen, die entgegengesetzte Anweisung — sehen Sie auf die Tonnamen.',
        ],
      },
      {
        question: 'Wie lang ist eine punktierte halbe Note im 4/4-Takt?',
        options: ['Zwei Schläge', 'Drei Schläge', 'Vier Schläge', 'Sechs Schläge'],
        explain: 'Die halbe Note hat zwei Schläge, der Punkt fügt die Hälfte davon hinzu — also drei.',
      },
      { title: 'Im Stück hören', body: ['„London Bridge“ beginnt schon im ersten Takt mit dem punktierten Rhythmus. Spielen Sie langsam genug, um das Lang-Kurz sauber zu zählen.'] },
    ],
  },

  // == Abschnitt 4: der Violinschlüssel =====================================

  't-staff': {
    title: 'Notensystem und Violinschlüssel',
    summary: 'Fünf Linien, vier Zwischenräume und wo die Noten darauf sitzen.',
    steps: [
      {
        title: 'Höher auf dem Papier, höher auf der Klaviatur',
        body: [
          'Noten stehen auf einem **System**: fünf Linien mit vier Zwischenräumen. Eine höher gezeichnete Note klingt höher. Das ist die ganze Idee.',
          'Das geschwungene Zeichen am Anfang ist ein **Schlüssel**, und er legt fest, welche Linie welchen Ton bedeutet. Der Violinschlüssel windet sich um die zweite Linie von unten, und diese Linie ist **{note:G4}**, das {note:G} über dem eingestrichenen {note:C}. Deshalb heißt er auch G-Schlüssel.',
          'Von diesem einen Anker aus ergibt sich alles Weitere durch Schritte nach oben und unten: Linie, Zwischenraum, Linie, Zwischenraum.',
        ],
      },
      {
        title: 'Die Linien',
        body: [
          'Von unten nach oben stehen auf den **Linien** des Violinsystems {note:E4}, {note:G4}, {note:B4}, {note:D5} und {note:F5}.',
          'Viele lernen dafür einen Merkspruch. Nutzen Sie ihn, wenn er hilft — das Ziel ist aber, das Übersetzen sein zu lassen. Am Ende sollen Sie eine Note sehen und eine Taste spüren, ohne einen Namen dazwischen.',
        ],
      },
      {
        title: 'Die Zwischenräume',
        body: [
          'In den vier **Zwischenräumen** stehen, ebenfalls von unten, {note:F4}, {note:A4}, {note:C5} und {note:E5}.',
          'Linien und Zwischenräume wechseln sich ab, die ganze Leiter von der untersten Linie aufwärts lautet also {note:E4} {note:F4} {note:G4} {note:A4} {note:B4} {note:C5} {note:D5} {note:E5} {note:F5} — neun Stufen ohne Lücken.',
        ],
      },
      { title: 'Lesen und spielen', body: ['Spielen Sie die gezeigte Note. Lassen Sie sich bei den ersten Zeit; das Tempo kommt von selbst.'], prompt: 'Spielen Sie die Note aus dem Notensystem' },
    ],
  },

  't-landmarks': {
    title: 'Orientierungsnoten',
    summary: 'Drei Noten, die man sofort erkennt, und alles andere daran gemessen.',
    steps: [
      {
        title: 'Anker statt Abzählen',
        body: [
          'Jedes Mal von der untersten Linie aufwärts zu zählen ist langsam und wird nie schneller. Geübte Leser machen es anders: Sie merken sich einige **Orientierungsnoten** und messen alles andere an der nächstgelegenen.',
          'Für das Violinsystem lohnen sich drei besonders: **{note:C4}** auf seiner Hilfslinie unter dem System, **{note:G4}**, wo sich der Schlüssel windet, und **{note:E5}** im obersten Zwischenraum.',
          'Sind die automatisch, wird eine Note eine Stufe über {note:G4} ohne Zählen zum {note:A4} — Sie erkennen sie wie ein vertrautes Gesicht, statt Merkmal für Merkmal zu prüfen.',
        ],
      },
      { title: 'Anker üben', body: ['Dieselben drei Noten in wechselnder Folge. Zielen Sie auf sofortiges Erkennen statt auf Treffsicherheit — Fehler sind hier erlaubt.'], prompt: 'Spielen Sie die Note aus dem Notensystem' },
      {
        question: 'Warum Orientierungsnoten lernen, statt von der untersten Linie aufwärts zu zählen?',
        options: [
          'Zählen ist ungenau',
          'Erkennen ist weit schneller als Ausrechnen',
          'Nur Orientierungsnoten lohnen sich überhaupt',
          'So muss man den Schlüssel nicht lernen',
        ],
        explain: 'Zählen funktioniert, stößt aber weit unterhalb des Lesetempos an eine Grenze. Erkennen skaliert, Zählen nicht.',
      },
    ],
  },

  't-ledger': {
    title: 'Hilfslinien',
    summary: 'Was passiert, wenn eine Note nicht mehr ins System passt.',
    steps: [
      {
        title: 'Das System verlängern',
        body: [
          'Das eingestrichene {note:C} ist zu tief für das Violinsystem, also bekommt es eine eigene kleine **Hilfslinie**.',
          'Hilfslinien setzen einfach das Muster aus Linien und Zwischenräumen über das System hinaus fort. Eine Hilfslinie unter dem Violinsystem ist {note:C4}; der Zwischenraum darüber ist {note:D4}; die unterste Systemlinie ist {note:E4}.',
          'Nach oben funktioniert es genauso. Wechseln Sie weiter zwischen Linie und Zwischenraum, dann können Sie beliebig weit hinauf lesen.',
        ],
      },
      { title: 'Unter dem System', body: ['Diese Noten liegen alle um das eingestrichene {note:C} herum.'], prompt: 'Spielen Sie die Note aus dem Notensystem' },
      {
        title: 'Über dem System',
        body: [
          'Über dem Violinsystem geht die Leiter weiter: {note:G5} im Zwischenraum über der obersten Linie, dann {note:A5} auf der ersten Hilfslinie, {note:B5} im Zwischenraum, {note:C6} auf der zweiten Hilfslinie.',
          'Ab etwa drei Hilfslinien schreiben Herausgeber meist **8va** und drucken die Noten eine Oktave tiefer — für das Auge sehr viel angenehmer.',
        ],
      },
      { title: 'Hohe Noten', body: ['Diese Noten stehen über dem System auf Hilfslinien.'], prompt: 'Spielen Sie die Note aus dem Notensystem' },
    ],
  },

  't-intervals-reading': {
    title: 'Nach der Form lesen',
    summary: 'Lesen Sie den Abstand zwischen den Noten, nicht jede Note neu.',
    steps: [
      {
        title: 'Schritte, Sprünge und Griffe',
        body: [
          'Sehen Sie sich diese fünf Noten an. Statt jede zu benennen, achten Sie auf die **Form**: von der Linie in den Zwischenraum ist ein Schritt, von Linie zu nächster Linie ein Sprung, alles Weitere ein Griff.',
          'So arbeiten geübte Leser tatsächlich. Sie bestimmen die erste Note genau und folgen dann der Kontur, weil die Hand längst weiß, wie sich Schritt und Sprung anfühlen.',
          'Deshalb lassen sich schrittweise Melodien so viel leichter vom Blatt spielen als springende — unabhängig davon, welche Töne darin vorkommen.',
        ],
      },
      { title: 'Die Form spüren', body: ['Spielen Sie die fünf Töne. Achten Sie darauf: ein Sprung auf dem Papier ist eine übersprungene weiße Taste unter der Hand.'], prompt: 'Spielen Sie die Töne' },
      {
        title: 'Wie man ein neues Stück vom Blatt liest',
        body: [
          'Bevor Sie eine einzige Note spielen: Vorzeichen prüfen, Taktart prüfen, tiefsten und höchsten Ton suchen, damit Sie wissen, wo die Hände hingehören, und das Stück nach Wiederholungen absuchen.',
          'Dann spielen Sie **viel langsamer, als es würdevoll wirkt**, und halten bei Fehlern nicht an. Wer zum Korrigieren anhält, lernt anzuhalten; wer weiterspielt, lernt, den Platz zu halten.',
        ],
      },
      { title: 'Diese lesen', body: ['Ein neuer Satz, weiter auseinander. Suchen Sie das Intervall zur vorigen Note, statt jedes Mal von vorn anzufangen.'], prompt: 'Spielen Sie die Note aus dem Notensystem' },
      {
        question: 'Was ist vor dem Blattspiel eines neuen Stücks am nützlichsten?',
        options: [
          'Es so schnell wie möglich durchspielen, um ein Gefühl zu bekommen',
          'Den ersten Takt auswendig lernen',
          'Vorzeichen und Taktart prüfen und nach Mustern suchen',
          'Alle Tonnamen bestimmen und hineinschreiben',
        ],
        explain: 'Dreißig Sekunden Hinschauen sparen Minuten des Herumstocherns. Tonnamen hineinzuschreiben fühlt sich produktiv an, verhindert aber, dass Sie je lesen lernen.',
      },
    ],
  },

  // == Abschnitt 5: Bassschlüssel und Klaviersystem =========================

  'b-clef': {
    title: 'Der Bassschlüssel',
    summary: 'Die linke Hand bekommt ihr eigenes System, verankert auf {note:F}.',
    steps: [
      {
        title: 'Der F-Schlüssel',
        body: [
          'Die linke Hand spielt meist unterhalb des eingestrichenen {note:C}, was im Violinsystem einen Wald aus Hilfslinien bräuchte. Also bekommt sie ein eigenes System mit **Bassschlüssel**.',
          'Die beiden Punkte des Bassschlüssels sitzen beiderseits der zweiten Linie von oben, und diese Linie ist **{note:F3}**, das {note:F} unter dem eingestrichenen {note:C}. Daher der andere Name: F-Schlüssel.',
          'Alles, was Sie über Linien, Zwischenräume und Hilfslinien gelernt haben, gilt unverändert. Nur der Anker ist verschoben.',
        ],
      },
      {
        title: 'Linien und Zwischenräume',
        body: [
          'Die Linien des Basssystems lauten von unten {note:G2}, {note:B2}, {note:D3}, {note:F3} und {note:A3}. Die Zwischenräume sind {note:A2}, {note:C3}, {note:E3} und {note:G3}.',
          'Ein nützlicher Anker: Die unterste Linie ist {note:G2}, die oberste {note:A3} — das Basssystem umfasst also fast genau zwei Oktaven unter dem eingestrichenen {note:C}.',
        ],
      },
      { title: 'Das Basssystem lesen', body: ['Spielen Sie jede Note mit der linken Hand.'], prompt: 'Spielen Sie die Note aus dem Notensystem' },
    ],
  },

  'b-landmarks': {
    title: 'Anker im Bassschlüssel',
    summary: 'Derselbe Trick wie im Violinschlüssel, ein System tiefer.',
    steps: [
      {
        title: 'Vier, die sitzen müssen',
        body: [
          'Das eingestrichene {note:C4} liegt auf einer Hilfslinie **über** dem Basssystem — spiegelbildlich zu seiner Lage unter dem Violinsystem.',
          '{note:F3} ist dort, wo die Punkte des Schlüssels sind. {note:C3} ist der zweite Zwischenraum von unten. {note:F2} der unterste Zwischenraum. Dazwischen erreichen Sie alles in einem Schritt.',
          'Das Lesen im Bassschlüssel wirkt vor allem deshalb schwerer, weil es weniger geübt wird. Geben Sie ihm dieselbe Zeit wie dem Violinschlüssel, und er holt schnell auf.',
        ],
      },
      { title: 'Anker üben', body: ['Linke Hand, gemischte Reihenfolge.'], prompt: 'Spielen Sie die Note aus dem Notensystem' },
      {
        question: 'Wo liegt das eingestrichene {note:C} in Bezug auf das Basssystem?',
        options: ['Auf der obersten Linie', 'Im obersten Zwischenraum', 'Zwei Hilfslinien darüber', 'Eine Hilfslinie darüber'],
        explain: 'Eine Hilfslinie über dem Basssystem — dieselbe Taste wie eine Hilfslinie unter dem Violinsystem.',
      },
    ],
  },

  'b-grand-staff': {
    title: 'Das Klaviersystem',
    summary: 'Zwei Systeme, eine Klaviatur, und das eingestrichene {note:C} in der Lücke dazwischen.',
    steps: [
      {
        title: 'In der Mitte verbunden',
        body: [
          'Klaviernoten benutzen beide Systeme gleichzeitig, durch eine Klammer zum **Klaviersystem** verbunden. Violin oben für die rechte Hand, Bass unten für die linke.',
          'Das Raffinierte ist die Lücke: Das eingestrichene {note:C} sitzt auf einer Hilfslinie genau in der Mitte. Es kann unter dem Violinsystem hängen oder über dem Basssystem stehen — es ist dieselbe Taste.',
          'Die beiden Systeme sind eigentlich eine durchgehende Leiter aus Linien und Zwischenräumen, mit {note:C4} als mittlerer Sprosse.',
        ],
      },
      { title: 'Beide Systeme lesen', body: ['Noten über der Lücke sind rechte Hand, darunter linke.'], prompt: 'Spielen Sie die Note aus dem Notensystem' },
      {
        question: 'Eine Note steht auf einer Hilfslinie direkt über dem Basssystem. Welche Note ist das?',
        options: ['{note:B3}', '{note:C4}', '{note:A3}', '{note:D4}'],
        explain: 'Eine Hilfslinie über dem Basssystem ist das eingestrichene {note:C} — dieselbe Taste wie eine Hilfslinie unter dem Violinsystem.',
      },
    ],
  },

  'b-both-hands-reading': {
    title: 'Zwei Systeme gleichzeitig lesen',
    summary: 'Das Auge lernt, einen senkrechten Ausschnitt zu erfassen statt einer Zeile.',
    steps: [
      {
        title: 'Erst senkrecht, dann waagerecht',
        body: [
          'Der Reflex ist, die obere Zeile wie einen Satz zu lesen und dann für die untere zurückzugehen. Das bricht in dem Moment zusammen, in dem die Hände Verschiedenes tun.',
          'Lesen Sie stattdessen einen **senkrechten Ausschnitt**: was zusammen klingt, dann das Nächste. Das Auge erfasst beide Systeme auf einmal und bewegt sich als Einheit nach rechts.',
          'Das lässt sich gezielt üben. Spielen Sie die Hände getrennt, bis jede sitzt, setzen Sie sie dann im halben Tempo zusammen und schauen Sie nur dorthin, wo sich die beiden Linien treffen.',
        ],
      },
      { title: 'Ein Ausschnitt', body: ['Linke Hand {note:C3}, rechte Hand {note:E4}, gemeinsam klingend.'], prompt: 'Spielen Sie beide Töne zusammen' },
      { title: 'Und der nächste', body: ['Die linke Hand bleibt, die rechte geht eine Stufe hinauf. Nur eines ändert sich — so ist der Klaviersatz meistens gebaut.'], prompt: 'Spielen Sie beide Töne zusammen' },
      { title: 'An einem Stück üben', body: ['In „Bruder Jakob“ bleibt die linke Hand fast stehen, während die rechte sich bewegt. Lesen Sie es in Ausschnitten.'] },
    ],
  },

  // == Abschnitt 6: Kreuze und Bes ==========================================

  'a-half-steps': {
    title: 'Halbtöne und Ganztöne',
    summary: 'Der kleinste Abstand am Klavier — und der, der aus zweien besteht.',
    steps: [
      {
        title: 'Der kleinste Abstand',
        body: [
          'Ein **Halbton** ist der Abstand von einer Taste zur unmittelbar nächsten, schwarz oder weiß, ohne etwas dazwischen.',
          'Meist ist eine schwarze Taste beteiligt: von {note:C} zur schwarzen Taste darüber ist ein Halbton. Aber zwei Paare weißer Tasten bilden einen Halbton ganz ohne schwarze Taste — {note:E} zu {note:F} und {note:B} zu {note:C}. Sehen Sie hin: Dort fehlt die schwarze Taste einfach.',
          'Ein **Ganzton** sind zwei Halbtöne. {note:C} zu {note:D} ist ein Ganzton, weil eine Taste dazwischenliegt.',
        ],
      },
      { title: 'Drei Tasten hintereinander', body: ['Spielen Sie {note:C}, dann die schwarze Taste darüber, dann {note:D}. Zwei Halbtöne, zusammen ein Ganzton.'], prompt: 'Spielen Sie drei Tasten nacheinander' },
      { title: 'Die weißen Halbtöne', body: ['Nun {note:E} zu {note:F} und {note:B} zu {note:C}. Benachbarte weiße Tasten und trotzdem nur ein Halbton.'], prompt: 'Spielen Sie die vier Töne' },
      {
        question: 'Wie viele Halbtöne liegen zwischen {note:E} und {note:F}?',
        options: ['Keiner — das ist derselbe Ton', 'Einer', 'Zwei', 'Drei'],
        explain: 'Es sind benachbarte weiße Tasten ohne schwarze dazwischen, also genau ein Halbton. Dasselbe gilt für {note:B} und {note:C}.',
      },
    ],
  },

  'a-sharps-flats': {
    title: 'Kreuz, B und Auflösungszeichen',
    summary: 'Drei Zeichen, die eine Note um eine Taste verschieben.',
    steps: [
      {
        title: 'Hinauf, hinunter, aufheben',
        body: [
          'Ein **Kreuz** (♯) erhöht eine Note um einen Halbton — eine Taste nach rechts, schwarz oder weiß. Ein **B** (♭) erniedrigt sie um einen Halbton. Ein **Auflösungszeichen** (♮) hebt beides auf und stellt die einfache weiße Taste wieder her.',
          'Ein Versetzungszeichen gilt bis zum Ende des Takts, in dem es steht, und verfällt am Taktstrich. Darauf fällt jeder mindestens einmal herein.',
          'Im Notenbild steht das Zeichen **vor** der Note, gesprochen wird es **nach** dem Namen: Sie schreiben ♯ und die Note, sagen aber „{note:C}is“ oder „{note:C}-Kreuz“.',
        ],
      },
      { title: 'Schwarze Tasten unter der Hand', body: ['Spielen Sie diese fünf schwarzen Tasten nacheinander. Nehmen Sie die flachere Stelle der Fingerkuppe und greifen Sie etwas tiefer in die Klaviatur als bei weißen Tasten.'], prompt: 'Spielen Sie die schwarzen Tasten' },
      { title: 'Versetzungszeichen lesen', body: ['Vor jeder dieser Noten steht ein Kreuz.'], prompt: 'Spielen Sie die Note aus dem Notensystem' },
      {
        question: 'In einem Takt steht ein erhöhtes {note:F}, später im selben Takt noch ein {note:F} ganz ohne Zeichen. Was spielen Sie?',
        options: ['Die weiße Taste, das Zeichen ist ja weg', 'Das hängt von den Vorzeichen ab', 'Wieder das Kreuz — Versetzungszeichen gelten bis zum Taktende', 'Die Note eine Oktave höher'],
        explain: 'Ein Versetzungszeichen gilt bis zum Ende seines Takts. Im nächsten Takt setzen Komponisten oft ein Warnungs-Auflösungszeichen zur Sicherheit.',
      },
    ],
  },

  'a-enharmonics': {
    title: 'Zwei Namen, eine Taste',
    summary: 'Warum dieselbe schwarze Taste mal ein Kreuz und mal ein B ist.',
    steps: [
      {
        title: 'Enharmonische Verwechslung',
        body: [
          'Die schwarze Taste zwischen {note:C} und {note:D} kann {note:C}is heißen ({note:C} erhöht) oder {note:D}es ({note:D} erniedrigt). Dieselbe Taste, derselbe Klang, zwei Namen. Solche Töne nennt man **enharmonisch verwechselt**.',
          'Welcher Name richtig ist, hängt davon ab, wohin die Musik geht. In einer Kreuz-Tonart schreibt man Kreuze, in einer B-Tonart Bes. Beides zu mischen macht eine Seite deutlich schwerer lesbar.',
          'Die Schreibweise ist auch dort wichtig, wo das Ohr keinen Unterschied hört, denn Lesen ist Mustererkennung. Eine Tonleiter mit einem Buchstaben pro Linie und Zwischenraum ist ein Muster; eine, in der Buchstaben springen und sich wiederholen, ist ein Rätsel.',
        ],
      },
      { title: 'Dieselbe Taste zweimal', body: ['Hier ist diese schwarze Taste zweimal gespielt. Zu hören gibt es nichts — der Unterschied liegt ganz in der Schreibweise.'] },
      {
        question: 'Welche Taste klingt genauso wie {note:D}es?',
        options: ['{note:C}is', '{note:D}is', '{note:C}', '{note:E}s'],
        explain: '{note:D}es liegt eine Taste unter {note:D}; {note:C}is eine Taste über {note:C}. Es ist dieselbe schwarze Taste.',
      },
    ],
  },

  // == Abschnitt 7: Tonleitern und Tonarten =================================

  's-major-formula': {
    title: 'Die Durtonleiter',
    summary: 'Eine Formel aus Ganz- und Halbtönen, von jedem Ton aus spielbar.',
    steps: [
      {
        title: 'Ganz ganz halb, ganz ganz ganz halb',
        body: [
          'Eine Durtonleiter besteht aus sieben Tönen nach einem festen Rezept: **Ganzton, Ganzton, Halbton, Ganzton, Ganzton, Ganzton, Halbton**, und endet eine Oktave über dem Ausgangston.',
          'Beginnen Sie auf {note:C} und folgen Sie dem Rezept, landen Sie auf lauter weißen Tasten. Deshalb fangen alle mit {note:C}-Dur an.',
          'Beginnen Sie irgendwo anders, zwingt dasselbe Rezept Sie auf schwarze Tasten. Das ist keine Komplikation, sondern der ganze Grund, warum es Kreuze und Bes gibt. Die Formel bleibt gleich, und die schwarzen Tasten sind der Preis dafür.',
        ],
      },
      { title: 'Das Rezept spielen', body: ['Acht Töne aufwärts von {note:C4}. Hören Sie auf die beiden Halbtöne — zwischen dem dritten und vierten Ton und zwischen dem siebten und achten.'], prompt: 'Spielen Sie die {note:C}-Dur-Tonleiter' },
      {
        question: 'Wenn man die Dur-Formel auf {note:G} anwendet, welcher Ton muss erhöht werden?',
        options: ['{note:C}, zu {note:C}is', '{note:F}, zu {note:F}is', '{note:B}, zu {note:B}', 'Keiner — es sind lauter weiße Tasten'],
        explain: 'Der letzte Schritt muss ein Halbton zum {note:G} sein, also wird {note:F} zu {note:F}is. Daher hat {note:G}-Dur ein Kreuz.',
      },
    ],
  },

  's-c-major-fingering': {
    title: 'Fingersatz und Daumenuntersatz',
    summary: 'Fünf Finger, acht Töne, eine unverzichtbare Bewegung.',
    steps: [
      {
        title: 'Das Problem und seine Lösung',
        body: [
          'Eine Tonleiter hat acht Töne und Sie haben fünf Finger; irgendwann muss die Hand also weiterrücken, ohne die Linie zu zerreißen. Die Lösung ist der **Daumenuntersatz**: Der Daumen wandert unter der Handfläche hindurch und landet auf dem nächsten Ton, während die anderen Finger noch spielen.',
          'Rechte Hand aufwärts: 1 2 3 auf {note:C} {note:D} {note:E}, dann schlüpft der Daumen unter und nimmt {note:F}, und 2 3 4 5 vollenden die Oktave.',
          'Der Arm sollte dabei ruhig bleiben. Schwingt der Ellenbogen nach außen, um dem Daumen zu helfen, kämpft die Hand gegen sich selbst — lassen Sie den Daumen allein wandern.',
        ],
      },
      { title: 'Rechte Hand, aufwärts', body: ['Achten Sie auf den Daumen beim vierten Ton. Ziel ist, dass beim Lagenwechsel kein Lautstärkesprung entsteht — genau dieser Sprung verrät den Anfänger.'], prompt: 'Spielen Sie die Tonleiter aufwärts' },
      { title: 'Rechte Hand, abwärts', body: ['Abwärts kreuzt der dritte Finger **über** den Daumen. Dieselbe Bewegung rückwärts.'], prompt: 'Spielen Sie die Tonleiter abwärts' },
      { title: 'Linke Hand, aufwärts', body: ['Die linke Hand spiegelt: 5 4 3 2 1, dann kreuzt der dritte Finger über den Daumen für die letzten drei Töne.'], prompt: 'Spielen Sie die Tonleiter mit der linken Hand' },
      { title: 'Mit dem Klick', body: ['Jetzt im Takt. Langsam. Der ganze Wert von Tonleiterübungen liegt in der Gleichmäßigkeit, und die gibt es nur in einem Tempo, das Sie beherrschen.'], prompt: 'Spielen Sie eine Note pro Klick' },
    ],
  },

  's-g-and-f': {
    title: '{note:G}-Dur und {note:F}-Dur',
    summary: 'Ihre erste schwarze Taste innerhalb einer Tonleiter — in beide Richtungen.',
    steps: [
      {
        title: 'Ein Kreuz',
        body: [
          '{note:G}-Dur braucht {note:F}is, damit die Formel aufgeht. Weil das Kreuz auf dem siebten Ton liegt, bleibt der Fingersatz genau wie in {note:C}-Dur: 1 2 3, Daumen unter, 2 3 4 5.',
          'Die Vorzeichen am Anfang des Systems tragen dieses Kreuz, damit es nicht bei jedem {note:F} geschrieben werden muss.',
        ],
      },
      { title: '{note:G}-Dur spielen', body: ['Der siebte Ton ist die schwarze Taste. Alles andere ist weiß.'], prompt: 'Spielen Sie die {note:G}-Dur-Tonleiter' },
      {
        title: 'Ein B',
        body: [
          '{note:F}-Dur geht in die andere Richtung und braucht ein {note:B}. Diesmal fällt die schwarze Taste auf den vierten Ton, was den Fingersatz ändert: Die rechte Hand spielt 1 2 3 4 und setzt dann den Daumen unter den fünften Ton.',
          'Das ist die allgemeine Regel für Tonleiterfingersätze — so einrichten, dass der Daumen nie auf einer schwarzen Taste landet.',
        ],
      },
      { title: '{note:F}-Dur spielen', body: ['1 2 3 4, Daumen unter, 2 3 4. Der vierte Ton ist das {note:B}.'], prompt: 'Spielen Sie die {note:F}-Dur-Tonleiter' },
      {
        question: 'Warum hat {note:F}-Dur einen anderen Fingersatz in der rechten Hand als {note:C}-Dur?',
        options: [
          'Weil es mehr Töne hat',
          'Damit der Daumen nie auf einer schwarzen Taste landet',
          'Weil Bes anders gespielt werden als Kreuze',
          'Hat es nicht — der Fingersatz ist gleich',
        ],
        explain: 'Der Daumen ist kurz und sitzt tief; auf einer erhöhten Taste drückt er das Handgelenk hoch und zerreißt die Linie. Fingersätze sind genau darum herum gebaut.',
      },
    ],
  },

  's-key-signatures': {
    title: 'Vorzeichen',
    summary: 'Die Kreuze einmal am Anfang schreiben statt bei jeder Note.',
    steps: [
      {
        title: 'Eine Abkürzung, die zum Namen wurde',
        body: [
          'Wenn in einem Stück in {note:G}-Dur jedes {note:F} erhöht sein muss, ist es mühsam, bei jedem ein Kreuz zu schreiben. Stattdessen setzt man ein einziges Kreuz auf die {note:F}-Linie am Anfang jedes Systems — die **Vorzeichen** — und von da an ist jedes {note:F} erhöht, solange kein Auflösungszeichen es aufhebt.',
          'Kreuze sammeln sich immer in derselben Reihenfolge: {note:F} {note:C} {note:G} {note:D} {note:A} {note:E} {note:B}. Ein Kreuz ist {note:G}-Dur, zwei sind {note:D}-Dur, drei sind {note:A}-Dur und so weiter.',
          'Ein Trick zum Ablesen: Das **letzte Kreuz** ist immer die siebte Stufe der Tonleiter, die Tonart liegt also einen Halbton darüber. Drei Kreuze enden auf {note:G}is; einen Halbton höher ist {note:A}-Dur.',
        ],
      },
      {
        title: 'Bes gehen andersherum',
        body: [
          'Bes erscheinen in genau umgekehrter Reihenfolge: {note:B} {note:E} {note:A} {note:D} {note:G} {note:C} {note:F}. Ein B ist {note:F}-Dur, zwei sind {note:B}-Dur, drei sind {note:E}s-Dur.',
          'Bei Bes ist der Trick noch einfacher: Ab zwei Vorzeichen benennt das **vorletzte B** die Tonart. Drei Bes sind {note:B}, {note:E}s, {note:A}s — und das vorletzte, {note:E}s, ist die Tonart.',
        ],
      },
      {
        question: 'Ein Stück hat zwei Kreuze als Vorzeichen. Welche sind das?',
        options: [
          '{note:F}is und {note:C}is',
          '{note:B} und {note:E}s',
          '{note:C}is und {note:G}is',
          '{note:F}is und {note:B}',
        ],
        explain: 'Kreuze erscheinen stets in der Reihenfolge {note:F} {note:C} {note:G} {note:D} {note:A} {note:E} {note:B}; zwei Kreuze sind also {note:F}is und {note:C}is — die Tonart {note:D}-Dur.',
      },
      {
        question: 'Wie findet man die Durtonart aus Kreuzvorzeichen?',
        options: [
          'Die Kreuze zählen und ebenso viele Töne von {note:C} aufwärts gehen',
          'Das letzte Kreuz nehmen und einen Halbton hinaufgehen',
          'Das erste Kreuz nehmen und einen Ganzton hinuntergehen',
          'Auf die erste Note des Stücks sehen',
        ],
        explain: 'Das letzte Kreuz ist die siebte Stufe, also liegt einen Halbton darüber die Tonika.',
      },
    ],
  },

  's-circle-of-fifths': {
    title: 'Der Quintenzirkel',
    summary: 'Warum die Tonarten in dieser Reihenfolge stehen und warum das nützt.',
    steps: [
      {
        title: 'Jede Tonart eine Quinte über der vorigen',
        body: [
          'Beginnen Sie auf {note:C}, zählen Sie fünf Tonleiterschritte hinauf und Sie landen auf {note:G} — der Tonart mit einem Kreuz. Noch einmal, und Sie sind bei {note:D} mit zweien. Wieder, und es ist {note:A} mit dreien. Nach zwölf Schritten sind Sie zurück bei {note:C}.',
          'Im Kreis angeordnet ergibt das den **Quintenzirkel**: im Uhrzeigersinn kommt ein Kreuz dazu, gegen den Uhrzeigersinn ein B, und jede Tonart steht neben den beiden, mit denen sie am engsten verwandt ist.',
          'Benachbarte Tonarten teilen alle Töne bis auf einen. Deshalb wechselt Musik so leicht zwischen ihnen, deshalb liegt die {note:V}-Stufe eine Quinte über der {note:I}, und deshalb taucht der Zirkel überall wieder auf.',
        ],
      },
      { title: 'Den Zirkel abschreiten', body: ['{note:C}, {note:G}, {note:D}, {note:A}, {note:E} — fünf Tonarten, jede eine Quinte höher und ein Kreuz weiter.'], prompt: 'Spielen Sie die fünf Grundtöne' },
      {
        question: 'Zwei Tonarten stehen im Quintenzirkel nebeneinander. Wie viele Töne haben ihre Tonleitern gemeinsam?',
        options: ['Alle sieben', 'Drei', 'Sechs von sieben', 'Keinen'],
        explain: 'Nachbarn unterscheiden sich in genau einem Vorzeichen, also sind sechs von sieben Tönen gemeinsam. Diese Nähe macht den Wechsel so glatt.',
      },
    ],
  },

  's-minor': {
    title: 'Molltonleitern',
    summary: 'Dieselben sieben Tasten, ein anderes Zuhause, eine andere Stimmung.',
    steps: [
      {
        title: 'Die parallele Molltonart',
        body: [
          'Spielen Sie alle weißen Tasten von {note:A} bis {note:A} statt von {note:C} bis {note:C}, und Sie haben **{note:A}-Moll natürlich**. Dieselben Tasten, ein anderer Ausgangspunkt, ein völlig anderer Charakter.',
          'Zu jeder Durtonart gehört eine **parallele Molltonart** auf der sechsten Stufe, mit denselben Vorzeichen. {note:C}-Dur und {note:A}-Moll haben keine; {note:G}-Dur und {note:E}-Moll je ein Kreuz.',
          'Die Formel lautet **ganz, halb, ganz, ganz, halb, ganz, ganz**. Gegenüber Dur sind die dritte, sechste und siebte Stufe je einen Halbton tiefer — und die tiefe Terz ist das, was das Ohr als „traurig“ hört.',
        ],
      },
      { title: '{note:A}-Moll natürlich spielen', body: ['Nur weiße Tasten, von {note:A} bis {note:A}.'], prompt: 'Spielen Sie {note:A}-Moll natürlich' },
      { title: 'Dur und Moll nebeneinander', body: ['Zwei Akkorde: erst Dur, dann Moll. Nur der mittlere Ton bewegt sich, um einen einzigen Halbton, und die ganze Stimmung kippt.'] },
      {
        title: 'Harmonisches Moll',
        body: [
          'Natürliches Moll hat einen schwachen Schluss. Seine siebte Stufe liegt einen Ganzton unter der Tonika und zieht deshalb nicht so nach Hause wie in Dur.',
          'Komponisten beheben das, indem sie die siebte Stufe um einen Halbton erhöhen — das ergibt **harmonisches Moll**. In {note:A}-Moll heißt das {note:G}is. Der Abstand zwischen sechster und siebter Stufe wird dadurch anderthalb Töne groß, und dieses seltsam weite Intervall ist der Klang von allem, von Bach-Kadenzen bis zur nahöstlichen Volksmusik.',
          'Es gibt eine dritte Form, **melodisches Moll**, die aufwärts auch die sechste Stufe erhöht und abwärts zum natürlichen Moll zurückkehrt — ein Kompromiss, um diesen weiten Schritt in Melodien zu glätten.',
        ],
      },
      { title: '{note:A}-Moll harmonisch spielen', body: ['Wie zuvor, aber der siebte Ton ist jetzt {note:G}is. Hören Sie, wie viel stärker er zum obersten Ton zieht.'], prompt: 'Spielen Sie {note:A}-Moll harmonisch' },
      {
        question: 'Welche Tonart ist die parallele Molltonart zu {note:C}-Dur?',
        options: ['{note:C}-Moll', '{note:G}-Moll', '{note:A}-Moll', '{note:E}-Moll'],
        explain: 'Die parallele Molltonart steht auf der sechsten Stufe. Sechs Töne über {note:C} liegt {note:A}, und {note:A}-Moll hat genau dieselben Vorzeichen.',
      },
    ],
  },

  // == Abschnitt 8: Akkorde und Harmonie ====================================

  'c-intervals': {
    title: 'Intervalle beim Namen nennen',
    summary: 'Der Abstand zweier Töne und warum er nicht nur eine Zahl, sondern auch eine Qualität hat.',
    steps: [
      {
        title: 'Zahl und Qualität',
        body: [
          'Ein **Intervall** ist der Abstand zweier Töne. Es hat eine Zahl — zählen Sie die Tonnamen einschließlich, {note:C} bis {note:E} ist also eine Terz — und eine Qualität, die sagt, wie weit diese Terz genau ist.',
          'Eine **große Terz** sind vier Halbtöne ({note:C} bis {note:E}). Eine **kleine Terz** drei ({note:C} bis {note:E}s). Dieselbe Zahl, andere Qualität, völlig anderer Klang.',
          'Quarten, Quinten und Oktaven heißen **rein** statt groß oder klein, aus historischen Gründen, die praktisch kaum eine Rolle spielen. Eine reine Quinte hat sieben Halbtöne und ist nach der Oktave das stabilste Intervall überhaupt.',
        ],
      },
      { title: 'Große und kleine Terz', body: ['Zwei Intervalle über demselben Grundton. Ein Ton bewegt sich um einen einzigen Halbton.'] },
      { title: 'Eine reine Quinte', body: ['{note:C} und {note:G} zusammen — sieben Halbtöne. Offen, stabil, ein wenig hohl.'], prompt: 'Spielen Sie die beiden Töne zusammen' },
      { title: 'Eine reine Quarte', body: ['{note:C} und {note:F} — fünf Halbtöne. Die umgekehrte Quinte.'], prompt: 'Spielen Sie die beiden Töne zusammen' },
      {
        question: 'Wie viele Halbtöne hat eine kleine Terz?',
        options: ['Zwei', 'Drei', 'Vier', 'Fünf'],
        explain: 'Drei. Die große Terz hat vier; senkt man den oberen Ton um einen Halbton, wird sie klein.',
      },
    ],
  },

  'c-triads': {
    title: 'Dreiklänge: Dur und Moll',
    summary: 'Drei Töne, jedes Mal eine Taste übersprungen.',
    steps: [
      {
        title: 'Übereinandergestellte Terzen',
        body: [
          'Ein **Dreiklang** besteht aus drei Tönen einer Tonleiter, jeweils einen übersprungen: einen spielen, einen auslassen, den nächsten spielen, einen auslassen, den nächsten. Von {note:C} aus ergibt das {note:C} {note:E} {note:G}.',
          'Der Abstand vom unteren zum mittleren Ton bestimmt die Färbung. Eine große Terz macht ihn **Dur** — hell, gefestigt. Eine kleine Terz macht ihn **Moll** — dunkler, weicher. Die Rahmenintervalle bilden in beiden Fällen eine reine Quinte.',
          'Alles Weitere in der Harmonie ist eine Abwandlung dieser einen Figur, es lohnt sich also, sie von jedem Ton aus ohne Nachdenken bilden zu können.',
        ],
      },
      { title: '{note:C}-Dur', body: ['{note:C}, {note:E} und {note:G} zusammen. Finger 1, 3 und 5, die Hand entspannt — Sie lassen das Armgewicht auf die Tasten sinken, statt zu drücken.'], prompt: 'Spielen Sie einen {note:C}-Dur-Dreiklang' },
      { title: '{note:C}-Moll', body: ['Senken Sie den mittleren Ton um einen Halbton: {note:C}, {note:E}s, {note:G}.'], prompt: 'Spielen Sie einen {note:C}-Moll-Dreiklang' },
      {
        question: 'Was macht einen Dreiklang zu Moll statt zu Dur?',
        options: ['Der obere Ton ist tiefer', 'Der mittlere Ton ist einen Halbton tiefer', 'Er hat vier Töne', 'Er beginnt auf einer schwarzen Taste'],
        explain: 'Nur die Terz bewegt sich. Von vier auf drei Halbtöne verkleinert, wird aus Dur Moll; die Quinte bleibt unverändert.',
      },
    ],
  },

  'c-dim-aug': {
    title: 'Vermindert und übermäßig',
    summary: 'Was passiert, wenn sich auch die Quinte bewegt.',
    steps: [
      {
        title: 'Zusammendrücken und dehnen',
        body: [
          'Es gibt nur vier Möglichkeiten, zwei Terzen übereinanderzustellen. Dur und Moll sind zwei davon. Die übrigen entstehen, wenn sich die Quinte bewegt.',
          'Ein **verminderter** Dreiklang besteht aus zwei kleinen Terzen — {note:C} {note:E}s {note:G}es. Die Quinte ist um einen Halbton zusammengedrückt, und der Klang wirkt gespannt und unaufgelöst.',
          'Ein **übermäßiger** Dreiklang besteht aus zwei großen Terzen — {note:C} {note:E} {note:G}is. Die Quinte ist gedehnt, das Ergebnis klingt schwebend und leicht unwirklich — weshalb Filmkomponisten ständig danach greifen.',
        ],
      },
      { title: 'Vermindert', body: ['{note:C}, {note:E}s, {note:G}es. Zwei kleine Terzen.'], prompt: 'Spielen Sie einen verminderten Dreiklang' },
      { title: 'Übermäßig', body: ['{note:C}, {note:E}, {note:G}is. Zwei große Terzen.'], prompt: 'Spielen Sie einen übermäßigen Dreiklang' },
      { title: 'Alle vier hintereinander', body: ['Dur, Moll, vermindert, übermäßig — auf demselben Grundton. Achten Sie auf den Charakter jedes einzelnen.'] },
      {
        question: 'Welcher Dreiklang besteht aus zwei übereinandergestellten großen Terzen?',
        options: ['Dur', 'Moll', 'Vermindert', 'Übermäßig'],
        explain: 'Dur ist große Terz plus kleine Terz; übermäßig ist groß plus groß, wodurch die Quinte gedehnt wird.',
      },
    ],
  },

  'c-inversions': {
    title: 'Umkehrungen',
    summary: 'Derselbe Akkord, ein anderer Ton unten, viel weniger Handbewegung.',
    steps: [
      {
        title: 'Die Töne durchdrehen',
        body: [
          'Nehmen Sie den unteren Ton von {note:C} {note:E} {note:G} und setzen Sie ihn eine Oktave höher: {note:E} {note:G} {note:C}. Immer noch ein {note:C}-Dur-Akkord — nur in **erster Umkehrung**. Noch einmal, und Sie haben {note:G} {note:C} {note:E}, die **zweite Umkehrung**.',
          'Umkehrungen gibt es, damit die Hand stehen bleiben kann. Von {note:C}-Dur zu {note:F}-Dur in Grundstellung springt die ganze Hand. Nimmt man {note:F} in zweiter Umkehrung, bewegen sich zwei Finger und der Daumen bleibt liegen.',
          'Außerdem glätten sie den Bass — deshalb bleibt echte Musik selten lange in der Grundstellung.',
        ],
      },
      { title: 'Grundstellung', body: ['{note:C} {note:E} {note:G}.'], prompt: 'Spielen Sie {note:C}-Dur in Grundstellung' },
      { title: 'Erste Umkehrung', body: ['{note:E} {note:G} {note:C} — der Grundton ist nach oben gewandert.'], prompt: 'Spielen Sie {note:C}-Dur in erster Umkehrung' },
      { title: 'Zweite Umkehrung', body: ['{note:G} {note:C} {note:E}.'], prompt: 'Spielen Sie {note:C}-Dur in zweiter Umkehrung' },
      { title: 'Glatte Stimmführung', body: ['Jetzt {note:F}-Dur in zweiter Umkehrung — {note:C} {note:F} {note:A}. Von {note:C}-Dur in Grundstellung aus bewegt sich der Daumen gar nicht, und die beiden anderen Finger gehen je eine Taste hinauf.'], prompt: 'Spielen Sie {note:F}-Dur in zweiter Umkehrung' },
      {
        question: 'Was ist der wichtigste praktische Grund für Umkehrungen?',
        options: [
          'Sie klingen lauter',
          'Sie sind leichter zu lesen',
          'Sie ersparen der Hand Sprünge zwischen Akkorden',
          'Sie ändern den Namen des Akkords',
        ],
        explain: 'Der Akkord bleibt derselbe. Umkehrungen sorgen dafür, dass sich die Hand so wenig wie möglich bewegt und der Bass glatt läuft.',
      },
    ],
  },

  'c-primary': {
    title: 'Die drei Akkorde, die alles spielen',
    summary: '{note:I}, {note:IV} und {note:V} — und erstaunlich viele Lieder.',
    steps: [
      {
        title: 'Akkorde nummerieren',
        body: [
          'Bauen Sie auf jeder Stufe einer Durtonleiter einen Dreiklang, und Sie erhalten sieben Akkorde. Musiker bezeichnen sie mit römischen Ziffern — groß für Dur, klein für Moll. In {note:C}-Dur sind das I ii iii IV V vi vii°.',
          'Drei davon leisten die meiste Arbeit. **I** ist zu Hause. **V** erzeugt Spannung, die zurück zu I will. **IV** steht dazwischen und führt vom Zuhause weg, ohne den Sog von V.',
          'Der Schritt von V nach I heißt **Kadenz** und ist der stärkste Schluss der abendländischen Musik. Fast alles, was Sie kennen, endet so.',
        ],
      },
      { title: 'I — der Heimatakkord', body: ['{note:C} {note:E} {note:G}.'], prompt: 'Spielen Sie den {note:I}-Akkord' },
      { title: 'IV', body: ['{note:F} {note:A} {note:C}. Nehmen Sie ihn in zweiter Umkehrung, dann bewegt sich die Hand kaum vom letzten Akkord weg.'], prompt: 'Spielen Sie den {note:IV}-Akkord' },
      { title: 'V', body: ['{note:G} {note:B} {note:D}. Hören Sie, wie stark er zurück zu I will.'], prompt: 'Spielen Sie den {note:V}-Akkord' },
      { title: 'Die ganze Verbindung', body: ['I, IV, V, I. Vier Akkorde, und der Schluss klingt zwingend.'] },
      {
        question: 'Was ist in {note:G}-Dur der {note:V}-Akkord?',
        options: ['{note:C}-Dur', '{note:D}-Dur', '{note:E}-Moll', '{note:G}-Dur'],
        explain: 'Zählt man die {note:G}-Dur-Tonleiter hinauf, ist die fünfte Stufe {note:D}, also ist V der {note:D}-Dur-Akkord.',
      },
    ],
  },

  'c-sevenths': {
    title: 'Septakkorde',
    summary: 'Eine Terz mehr obendrauf, und die Harmonie wird erwachsen.',
    steps: [
      {
        title: 'Noch eine Terz aufsetzen',
        body: [
          'Führen Sie das Muster fort und setzen Sie über den Dreiklang eine weitere Terz, dann erhalten Sie einen **Septakkord** — vier Töne statt drei.',
          'Der wichtigste ist der **Dominantseptakkord** auf der fünften Stufe: ein Durdreiklang mit einer kleinen Septime darüber. In {note:C}-Dur ist das {note:G} {note:B} {note:D} {note:F}. Er enthält einen Tritonus und ist damit instabil — genau deshalb zieht er so stark nach Hause.',
          'Ein **großer Septakkord** ({note:C} {note:E} {note:G} {note:B}) klingt weich und schwebend. Ein **Moll-Septakkord** ({note:D} {note:F} {note:A} {note:C}) klingt mild und ungehetzt. Zusammen decken diese drei einen Großteil des Jazz und viel Popmusik ab.',
        ],
      },
      { title: 'Der Dominantseptakkord', body: ['{note:G} {note:B} {note:D} {note:F}. Finger 1 2 3 5.'], prompt: 'Spielen Sie den Dominantseptakkord' },
      { title: 'Großer Septakkord', body: ['{note:C} {note:E} {note:G} {note:B} — die Septime liegt nur einen Halbton unter der Oktave, daher dieses Schimmern.'], prompt: 'Spielen Sie den großen Septakkord' },
      { title: 'Moll-Septakkord', body: ['{note:D} {note:F} {note:A} {note:C}.'], prompt: 'Spielen Sie den Moll-Septakkord' },
      {
        question: 'Welcher Septakkord zieht am stärksten zur Tonika zurück?',
        options: ['Der Dominantseptakkord', 'Der große Septakkord', 'Der Moll-Septakkord', 'Alle gleich stark'],
        explain: 'Im Dominantseptakkord liegt zwischen Terz und Septime ein Tritonus, und dieses Intervall löst sich fast von selbst nach innen in den Tonikaakkord auf.',
      },
    ],
  },

  // == Abschnitt 9: beide Hände zusammen ====================================

  'h-blocked': {
    title: 'Akkorde der linken Hand unter einer Melodie',
    summary: 'Die einfachste Begleitung, die es gibt.',
    steps: [
      {
        title: 'Ein Akkord pro Takt',
        body: [
          'Am einfachsten begleiten Sie sich selbst, indem die linke Hand einen Akkord einen ganzen Takt lang hält, während die rechte die Melodie spielt.',
          'Der Fingersatz der linken Hand für einen Dreiklang in Grundstellung spiegelt den der rechten: **5, 3, 1** von unten, denn den tiefsten Ton nimmt der kleine Finger.',
          'Spielen Sie die Akkorde ein bis zwei Oktaven unter dem eingestrichenen {note:C}, damit sie die Melodie stützen statt sie zu bedrängen. Unterhalb von etwa {note:C2} werden Dreiklänge matschig — deshalb stehen dort einzelne Töne und leere Quinten.',
        ],
      },
      { title: 'Linke Hand, I', body: ['{note:C3} {note:E3} {note:G3} mit den Fingern 5, 3, 1.'], prompt: 'Spielen Sie {note:C}-Dur mit der linken Hand' },
      { title: 'Linke Hand, V', body: ['{note:G2} {note:B2} {note:D3}.'], prompt: 'Spielen Sie {note:G}-Dur mit der linken Hand' },
      { title: 'Linke Hand, IV', body: ['{note:F2} {note:A2} {note:C3}.'], prompt: 'Spielen Sie {note:F}-Dur mit der linken Hand' },
      { title: 'Beide Hände', body: ['Spielen Sie „Mary Had a Little Lamb“ mit beiden Händen. Beginnen Sie so langsam, dass Sie nie anhalten müssen — Anhalten ist genau das, was Sie nicht lernen wollen.'] },
    ],
  },

  'h-broken': {
    title: 'Gebrochene Akkorde und Alberti-Bass',
    summary: 'Wie aus einem gehaltenen Akkord Bewegung wird.',
    steps: [
      {
        title: 'Den Akkord auffächern',
        body: [
          'Einen Blockakkord vier Schläge lang zu halten wird schnell langweilig. Brechen Sie ihn stattdessen in einzelne Töne, und die Begleitung kommt in Bewegung.',
          'Das klassische Muster ist der **Alberti-Bass**: unten, oben, Mitte, oben. Auf einem {note:C}-Dur-Akkord ist das {note:C}, {note:G}, {note:E}, {note:G}, immer wieder unter der Melodie. Mozart hat es ständig benutzt.',
          'Halten Sie es leise. Eine Begleitung soll gespürt, nicht gehört werden — wenn sich die linke Hand als eigene Melodie heraushören lässt, ist sie zu laut.',
        ],
      },
      { title: 'Alberti-Bass auf I', body: ['{note:C} {note:G} {note:E} {note:G}, linke Hand, Finger 5 1 3 1.'], prompt: 'Spielen Sie das Muster' },
      { title: 'Alberti-Bass auf V', body: ['{note:G} {note:D} {note:B} {note:D}. Dieselbe Figur eine Quarte tiefer.'], prompt: 'Spielen Sie das Muster' },
      { title: 'Im Zusammenhang hören', body: ['Bachs Präludium in {note:C} ist ein einziger langer gebrochener Akkord. Spielen Sie es langsam und hören Sie, wie sich die Harmonie unter dem Muster verändert.'] },
    ],
  },

  'h-independence': {
    title: 'Unabhängigkeit der Hände',
    summary: 'Wie man den Händen abgewöhnt, einander nachzumachen.',
    steps: [
      {
        title: 'Warum das schwer ist',
        body: [
          'Ihre Hände wollen gleichzeitig dasselbe tun. Das ist eine Eigenschaft des Nervensystems, kein fehlendes Talent, und es verschwindet mit der richtigen Art von Übung.',
          'Der Kniff: Machen Sie eine Hand automatisch, bevor Sie die andere dazunehmen. Üben Sie die linke Hand, bis Sie sich dabei unterhalten können — und holen Sie dann die rechte dazu.',
          'Wenn Sie die Hände zum ersten Mal zusammensetzen, spielen Sie absurd langsam und achten Sie auf die **Treffpunkte**: die Momente, in denen beide Hände auf denselben Schlag kommen. Die richtig zu treffen ist die halbe Miete.',
        ],
      },
      { title: 'Abwechselnd', body: ['Links, rechts, links, rechts — die Hände wechseln sich ab, statt gemeinsam zu spielen. Das ist der sanfteste Einstieg.'], prompt: 'Spielen Sie die Töne der Reihe nach' },
      { title: 'Zusammen', body: ['Jetzt beide gleichzeitig. Ein Klang, zwei Hände.'], prompt: 'Spielen Sie beide Töne zusammen' },
      { title: 'Im Takt', body: ['Wechseln Sie die Hände bei jedem Metronomklick: links auf ungerade, rechts auf gerade Klicks.'], prompt: 'Spielen Sie eine Note pro Klick' },
    ],
  },

  'h-whole-piece': {
    title: 'Ein Stück richtig erarbeiten',
    summary: 'Eine Methode, die besser funktioniert als immer wieder von vorn anzufangen.',
    steps: [
      {
        title: 'Kleine Abschnitte, langsam, getrennte Hände',
        body: [
          'Ein Stück vom Anfang zu spielen, bis es zusammenbricht, und dann wieder von vorn — das heißt, den Anfang hundertmal und den Schluss zweimal zu üben. Jeder macht das. Es ist eine schlechte Methode.',
          'Stattdessen: Nehmen Sie **ein oder zwei Takte**. Spielen Sie sie mit getrennten Händen, bis beide leicht gehen. Setzen Sie sie langsam zusammen. Dann hängen Sie die Nachbartakte an. Erst wenn die Nahtstellen funktionieren, spielen Sie das Ganze.',
          'Der größte Teil Ihrer Übezeit sollte auf das entfallen, was Sie nicht können. Das macht deutlich weniger Spaß — und genau deshalb funktioniert es.',
        ],
      },
      {
        title: 'Langsam heißt langsam',
        body: [
          'Langsames Üben ist nicht dasselbe Stück, nur schleppend gespielt. Es ist eine andere Aufgabe: Im halben Tempo haben Sie Zeit, Handform, Fingersatz und Klang zu bemerken und zu korrigieren, bevor sie sich festsetzen.',
          'Benutzen Sie eine Tempoleiter. Spielen Sie eine Stelle dreimal hintereinander sauber, dann stellen Sie das Metronom um vier Schläge höher. Ein Fehler, und Sie gehen eine Stufe zurück. Es dauert länger, als es klingt, und ist schneller als alles andere.',
        ],
      },
      { title: 'An „Ode an die Freude“ ausprobieren', body: ['Nehmen Sie nur die ersten vier Takte, getrennte Hände, dann zusammen. Gehen Sie nicht weiter, bevor sie bequem sitzen.'] },
      { title: 'Und an „Stille Nacht“', body: ['Dieses steht im 3/4-Takt mit punktiertem Rhythmus, zählen Sie also laut mit. Zuerst nur die rechte Hand.'] },
    ],
  },

  // == Abschnitt 10: Technik ================================================

  'tech-evenness': {
    title: 'Gleichmäßigkeit und Klang',
    summary: 'Die unspektakuläre Fähigkeit, durch die alles andere gut klingt.',
    steps: [
      {
        title: 'Fünf Finger, fünf verschiedene Kräfte',
        body: [
          'Ihre Finger sind nicht gleich. Der Daumen ist ein dicker Hebel mit eigenem Muskel; der Ringfinger teilt sich eine Sehne mit dem Mittelfinger und hebt sich kaum allein. Sich selbst überlassen, gerät eine Fünftonfolge klumpig.',
          'Das auszugleichen ist der Sinn der Fünftonübungen. Spielen Sie so langsam, dass Sie **jeden Ton einzeln hören**, und suchen Sie den, der herausfällt — meist ist es der Daumen (zu laut) oder der Ringfinger (zu leise und zu spät).',
          'Spielen Sie aus dem Grundgelenk mit lockerem Handgelenk. Stärkerer Druck gleicht keinen ungleichen Finger aus; er macht die Ungleichheit nur lauter.',
        ],
      },
      { title: 'Hinauf und zurück', body: ['Neun Töne, langsam. Ziel sind neun gleiche Klänge. Anfangs gelingt das nicht, und genau das zu bemerken ist der Punkt.'], prompt: 'Spielen Sie die Töne gleichmäßig' },
      { title: 'Mit dem Klick', body: ['Jetzt mit Metronom auf 60, ein Ton pro Klick. Hören Sie zu, spielen Sie nicht bloß.'], prompt: 'Spielen Sie eine Note pro Klick' },
      { title: 'Die ganze Etüde', body: ['Eine kurze Fünftonetüde für beide Hände. Spielen Sie sie in einem Tempo, in dem jeder Ton unter Kontrolle ist — und dann noch etwas langsamer.'] },
    ],
  },

  'tech-scales-two-octaves': {
    title: 'Tonleitern über zwei Oktaven',
    summary: 'Zwei Daumenuntersätze statt einem und eine Hand, die weiterwandert.',
    steps: [
      {
        title: 'Das Muster wiederholt sich',
        body: [
          'Eine zweioktavige Tonleiter ist der einoktavige Fingersatz zweimal, oben aneinandergehängt: 1 2 3 1 2 3 4, dann noch einmal 1 2 3 1 2 3 4, und zum Schluss die 5.',
          'Der Unterschied: Die Hand muss jetzt entlang der Klaviatur weiterwandern, statt an einen Platz zurückzukehren. Lassen Sie den Arm die Hand seitwärts tragen — die Finger sollen nach nichts greifen müssen.',
          'Üben Sie viel länger mit getrennten Händen, als Sie für nötig halten. Zwei Oktaven mit beiden Händen sind wirklich eine andere Fähigkeit, und sie stellt sich erst ein, wenn jede Hand allein sicher ist.',
        ],
      },
      { title: 'Zwei Oktaven aufwärts', body: ['Fünfzehn Töne, rechte Hand, langsam. Achten Sie auf beide Daumenuntersätze.'], prompt: 'Spielen Sie zwei Oktaven' },
      {
        title: 'Worauf zu hören ist',
        body: [
          'Fast jede ungleiche Tonleiter erklärt sich aus drei Fehlern: ein Lautstärkesprung dort, wo der Daumen eintritt, eine Lücke im Klang beim Lagenwechsel, und ein Tempo, das unmerklich anzieht.',
          'Ein guter Test ist, die Tonleiter mit geschlossenen Augen zu spielen. Ohne den Blick hört man die Nahtstellen sofort.',
        ],
      },
      { title: 'Im Takt', body: ['Stellen Sie das Metronom auf ein Tempo, in dem nichts stolpert. Welches Tempo das auch ist — es ist das richtige.'], prompt: 'Spielen Sie eine Note pro Klick' },
    ],
  },

  'tech-arpeggios': {
    title: 'Arpeggien',
    summary: 'Dieselbe Daumenbewegung, nur über eine viel größere Strecke.',
    steps: [
      {
        title: 'Aufgefächerte Akkorde',
        body: [
          'Ein **Arpeggio** ist ein Akkord, Ton für Ton gespielt. {note:C} {note:E} {note:G} {note:C} {note:E} {note:G} {note:C} — die Töne eines {note:C}-Dur-Dreiklangs über zwei Oktaven.',
          'Der Fingersatz aufwärts lautet 1 2 3 1 2 3 5. Der Daumenuntersatz ist dieselbe Bewegung wie in der Tonleiter, nur muss er jetzt eine Quarte überbrücken statt einer Sekunde — der Arm muss also mehr mithelfen.',
          'Der häufigste Fehler ist ein Ruck: Der Ellenbogen schwingt hinaus, um den Daumen hinüberzuwerfen. Lassen Sie stattdessen den ganzen Arm gleichmäßig entlanggleiten, dann kommt der Daumen ohne Aufregung rechtzeitig an.',
        ],
      },
      { title: 'Aufwärts', body: ['Zwei Oktaven {note:C}-Dur-Arpeggio. Langsam.'], prompt: 'Spielen Sie das Arpeggio aufwärts' },
      { title: 'Abwärts', body: ['Abwärts kreuzt der dritte Finger über den Daumen — wie in der Tonleiter.'], prompt: 'Spielen Sie das Arpeggio abwärts' },
      { title: 'Die ganze Etüde', body: ['Arpeggien auf I, IV und V über einem stützenden Bass. Diese Figur liegt einer riesigen Menge Klaviermusik zugrunde.'] },
    ],
  },

  'tech-chords-octaves': {
    title: 'Oktaven, Akkorde und das Handgelenk',
    summary: 'Größere Griffe — und woher die Bewegung kommen soll.',
    steps: [
      {
        title: 'Der Arm spielt, die Finger halten',
        body: [
          'Bei einem einzelnen Ton macht der Finger die Arbeit. Bei einer Oktave oder einem vollen Akkord kann er es nicht: Der Griff ist fest, und der Klang muss von woanders kommen.',
          'Dieses Woanders ist **Handgelenk und Unterarm**. Bauen Sie zuerst die Handform, halten Sie sie fest und lassen Sie das Armgewicht hindurchsinken. Das Handgelenk bleibt beweglich und federt die Landung ab; es drückt nicht.',
          'Wenn Sie zwischen Akkorden greifen und pressen, arbeiten Sie viel härter, als die Musik verlangt. Lassen Sie die Hand in der Lücke ganz los, auch wenn die Lücke sehr kurz ist.',
        ],
      },
      { title: 'Eine Oktave', body: ['{note:C4} und {note:C5} zusammen, Finger 1 und 5. Lassen Sie den Arm sinken, statt zu spreizen und zu drücken.'], prompt: 'Spielen Sie die Oktave' },
      { title: 'Verschieben', body: ['Derselbe Griff eine Stufe höher. Bewegen Sie den ganzen Arm; spreizen Sie die Hand nicht neu.'], prompt: 'Spielen Sie die Oktave' },
      {
        title: 'Kleine Hände',
        body: [
          'Nicht jede Hand erreicht eine Oktave bequem, und sie zu erzwingen ist der direkte Weg zu einer Verletzung. Wenn es schmerzt, lassen Sie es.',
          'Fast jede Oktavstelle lässt sich brechen — den unteren Ton einen Sekundenbruchteil früher nehmen und beide mit dem Pedal verbinden. Zahlreiche professionelle Pianisten mit kleinen Händen machen genau das, ständig.',
        ],
      },
      {
        question: 'Woher soll die Kraft für einen lauten Akkord kommen?',
        options: ['Aus stärkerem Fingerdruck', 'Aus dem Zugreifen der Hand', 'Aus dem Armgewicht durch eine feste Handform', 'Aus hohem Anheben und Zuschlagen'],
        explain: 'Die Finger geben die Form, der Arm liefert das Gewicht. Ein Schlag aus der Höhe ist laut, aber unkontrolliert, und Greifen erzeugt nur Spannung.',
      },
    ],
  },

  'tech-practising': {
    title: 'Wie man übt',
    summary: 'Der Unterschied zwischen einer verbrachten Stunde und einer, die zählt.',
    steps: [
      {
        title: 'Aufmerksamkeit, nicht Zeit',
        body: [
          'Zwanzig Minuten konzentrierte Arbeit schlagen zwei Stunden Durchspielen dessen, was Sie ohnehin können. Der Maßstab einer Übeeinheit ist, was Sie am Anfang nicht konnten und am Ende können.',
          'Beginnen Sie jede Einheit mit der Entscheidung, woran Sie arbeiten. „Takte 9 bis 12, linke Hand, gleichmäßig, bei 60“ ist ein Übeziel. „Das Stück üben“ nicht.',
          'Hören Sie auf, wenn die Aufmerksamkeit nachlässt. Zerstreut zu üben bringt den Händen bei, zerstreut zu sein.',
        ],
      },
      {
        title: 'Langsam, in Häppchen, wiederholt, und schlafen',
        body: [
          'Vier Dinge erklären fast allen Fortschritt. **Langsam genug, um richtig zu sein**, denn Wiederholung verfestigt alles, was Sie wiederholen, Fehler eingeschlossen. **Kleine Abschnitte**, denn vier Takte auf einmal lassen sich nicht reparieren. **Wiederholung mit Aufmerksamkeit** — etwa fünf saubere Male hintereinander, bevor es weitergeht.',
          'Und **Schlaf**. Motorisches Lernen festigt sich über Nacht; eine Stelle, die Sie im Chaos zurücklassen, spielt sich am nächsten Morgen oft von selbst. Tägliches kurzes Üben schlägt eine lange Wocheneinheit deutlich.',
        ],
      },
      {
        title: 'Wenn es feststeckt',
        body: [
          'Wenn eine Stelle nicht besser wird, hören Sie auf, sie zu wiederholen, und ändern Sie etwas. Spielen Sie sie in anderem Rhythmus — punktiert, dann umgekehrt punktiert. Spielen Sie sie mit getrennten Händen. Spielen Sie sie vom letzten Ton rückwärts. Spielen Sie sie weg vom Klavier, auf dem Tisch, nur wegen des Fingersatzes.',
          'Und prüfen Sie den Fingersatz. Eine Stelle, die sich hartnäckig weigert, ist sehr oft ein verkleidetes Fingersatzproblem.',
        ],
      },
      {
        question: 'Sie haben zwanzig Minuten. Wie nutzen Sie sie am besten?',
        options: [
          'Ihre Lieblingsstücke einmal durchspielen',
          'Langsam an den zwei schwersten Takten eines Stücks arbeiten',
          'Die ganzen zwanzig Minuten Tonleitern spielen',
          'Die ganze Zeit etwas Neues vom Blatt lesen',
        ],
        explain: 'Zu spielen, was man schon kann, macht Freude, ändert aber nichts. Der Fortschritt steckt in gezielter Arbeit an dem, was Sie noch nicht können.',
      },
    ],
  },

  // == Abschnitt 11: musikalisch spielen ====================================

  'e-dynamics': {
    title: 'Dynamik',
    summary: 'Der Unterschied zwischen Noten spielen und Musik machen.',
    steps: [
      {
        title: 'Laut, leise und alles dazwischen',
        body: [
          'Dynamikzeichen sind italienische Abkürzungen: **pp** sehr leise, **p** leise, **mp** mäßig leise, **mf** mäßig laut, **f** laut, **ff** sehr laut. Eine Gabel `<` heißt allmählich lauter (*crescendo*), `>` allmählich leiser (*diminuendo*).',
          'Sie sind relativ, nicht absolut. Ein forte in einem Wiegenlied ist leiser als ein piano in einem Rachmaninow-Konzert. Wichtig ist der Unterschied zwischen benachbarten Bezeichnungen.',
          'Die häufigste Anfängergewohnheit ist, alles gleich laut zu spielen. Nehmen Sie eine vertraute Phrase und spielen Sie sie zweimal: einmal flach, einmal lauter im Anstieg und leiser im Abstieg. Die zweite Fassung klingt nach Musik.',
        ],
      },
      { title: 'Drei Lautstärken', body: ['Derselbe Akkord leise, mittel und laut gespielt. Geändert hat sich nur die Geschwindigkeit der Taste.'] },
      {
        title: 'Eine Linie formen',
        body: [
          'Eine brauchbare Grundregel: Melodien wachsen zu ihrem höchsten Ton hin und entspannen sich danach. Es ist kein Gesetz, trifft aber oft genug zu, um eine gute erste Annahme zu sein, wenn nichts eingezeichnet ist.',
          'Zielen Sie auf Allmählichkeit. Ein Crescendo, das erst beim letzten Ton eintrifft, ist keines — und das ist der häufigste Fehler.',
        ],
      },
      {
        question: 'Wovon hängt am Klavier die Lautstärke eines Tons ab?',
        options: [
          'Davon, wie stark Sie nach dem Anschlag drücken',
          'Von der Geschwindigkeit, mit der die Taste hinuntergeht',
          'Davon, wie lange Sie den Ton halten',
          'Davon, wie hoch Sie zuvor die Hand heben',
        ],
        explain: 'Von der Tastengeschwindigkeit, sonst nichts. Ist der Hammer einmal weg, ändert zusätzlicher Druck gar nichts.',
      },
    ],
  },

  'e-articulation': {
    title: 'Artikulation',
    summary: 'Wie Töne verbunden oder getrennt werden — die Zeichensetzung der Musik.',
    steps: [
      {
        title: 'Legato und Staccato',
        body: [
          '**Legato** heißt gebunden: Jeder Ton wird gehalten, bis der nächste erklingt, ganz ohne Lücke. Am Klavier ist das Fingerarbeit — Sie lassen eine Taste genau in dem Moment los, in dem die nächste hinuntergeht, und der Klang überlappt sich für einen Augenblick.',
          '**Staccato**, mit einem Punkt über der Note, heißt kurz und abgesetzt. Der Ton wird früh losgelassen, es bleibt Stille bis zum nächsten. Es geht um die Lücke, nicht um Härte oder Lautstärke.',
          'Dazwischen liegt **Tenuto** — ein Strich über der Note, der heißt: die volle Länge halten und dem Ton ein wenig Gewicht geben.',
        ],
      },
      { title: 'Dieselben Töne, zwei Arten', body: ['Fünf Töne legato, dann dieselben fünf staccato. Gleiche Höhen, gleiche Lautstärke, völlig anderer Charakter.'] },
      { title: 'Legato ausprobieren', body: ['Spielen Sie diese fünf Töne gebunden. Achten Sie auf Lücken: Hören Sie Stille zwischen den Tönen, heben Sie zu früh.'], prompt: 'Spielen Sie die Töne gebunden' },
      {
        question: 'Was verändert ein Staccatopunkt tatsächlich?',
        options: [
          'Wie lange der Ton dauert',
          'Wie laut der Ton ist',
          'Die Tonhöhe',
          'Welchen Finger man nimmt',
        ],
        explain: 'Staccato verkürzt den Ton und lässt Stille bis zum nächsten. Über die Lautstärke sagt es nichts — ein Staccatoton kann beliebig leise oder laut sein.',
      },
    ],
  },

  'e-pedal': {
    title: 'Das Haltepedal',
    summary: 'Töne verbinden, die die Finger nicht halten können.',
    steps: [
      {
        title: 'Was es wirklich tut',
        body: [
          'Das rechte Pedal hebt die Dämpfer von allen Saiten, sodass Töne weiterklingen, nachdem Sie die Tasten losgelassen haben, und das ganze Instrument mitschwingt.',
          'Es ist kein Lautstärkepedal und kein Mittel, Lücken im Spiel zu verdecken. Durch einen Harmoniewechsel hindurch gehalten, macht es aus Harmonie Matsch.',
          'In dieser App halten Sie die **Leertaste** für das Pedal, oder benutzen ein echtes Pedal, wenn ein MIDI-Keyboard angeschlossen ist.',
        ],
      },
      {
        title: 'Nachtreten',
        body: [
          'Die übliche Technik wechselt das Pedal **kurz nachdem** der neue Akkord erklungen ist, nicht gleichzeitig mit ihm. Spielen, dann in einer schnellen Bewegung loslassen und neu treten. Der neue Ton klingt bereits, es reißt also nichts, aber die alte Harmonie wird ausgeräumt.',
          'Die Faustregel: Wechseln Sie das Pedal, wann immer sich die Harmonie ändert. Wenn Sie zwei verschiedene Akkorde gleichzeitig klingen hören, waren Sie zu spät.',
          'Im Zweifel weniger. Ein sauberes Spiel ohne Pedal klingt weit besser als ein verwaschenes mit.',
        ],
      },
      { title: 'Ausprobieren', body: ['Halten Sie die Leertaste, spielen Sie diesen Akkord und lassen Sie die Tasten los — er klingt weiter. Dann lassen Sie die Leertaste los und hören, wie er abbricht.'], prompt: 'Spielen Sie den Akkord mit getretenem Pedal' },
      {
        question: 'Wann sollte das Pedal gewechselt werden?',
        options: [
          'Genau gleichzeitig mit dem neuen Akkord',
          'Kurz nachdem der neue Akkord erklungen ist',
          'Kurz vor dem neuen Akkord',
          'Einmal pro Takt, unabhängig von der Harmonie',
        ],
        explain: 'Ein Wechsel gleichzeitig mit dem Akkord reißt eine Lücke; kurz danach bleibt die Linie erhalten und die alte Harmonie wird trotzdem beseitigt.',
      },
    ],
  },

  'e-phrasing': {
    title: 'Phrasierung',
    summary: 'Musik atmet in Sätzen. Spielen Sie die Sätze, nicht die Wörter.',
    steps: [
      {
        title: 'Wo die Kommas stehen',
        body: [
          'Melodien bestehen aus **Phrasen** — musikalischen Sätzen von meist zwei oder vier Takten, mit Anfang, Verlauf und Ende. Bögen über dem System markieren sie.',
          'Jeden Ton gleich wichtig zu spielen ist wie monotones Vorlesen ohne Pausen. Geben Sie der Phrase stattdessen eine Richtung, lehnen Sie sich leicht auf ihren Höhepunkt und lassen Sie sie am Ende zur Ruhe kommen.',
          'Ein winziger Freiraum am Phrasenende bewirkt mehr als jede Dynamik. Sängerinnen atmen dort; Pianisten sollten es auch.',
        ],
      },
      { title: 'Eine Phrase hören', body: ['Acht Töne, die steigen und fallen. Hören Sie, wo sie wachsen und wo sie sich entspannen will.'] },
      { title: 'Jetzt selbst formen', body: ['Spielen Sie dieselben acht Töne. Wachsen Sie zum Höhepunkt, lassen Sie danach nach und nehmen Sie sich am Ende ein wenig Zeit.'], prompt: 'Spielen Sie die Phrase' },
      { title: 'An einem Stück üben', body: ['„Greensleeves“ besteht aus klaren viertaktigen Phrasen mit einem offensichtlichen Höhepunkt. Spielen Sie langsam und formen Sie jede einzelne.'] },
    ],
  },

  'e-balance': {
    title: 'Balance zwischen den Händen',
    summary: 'Die Melodie muss sich durchsetzen, und von allein tut sie das nicht.',
    steps: [
      {
        title: 'Melodie lauter, Begleitung leiser',
        body: [
          'In fast aller Klaviermusik ist eine Linie die Melodie und der Rest Begleitung. Die Melodie sollte merklich lauter sein — oft deutlich mehr, als es sich von der Bank aus richtig anfühlt.',
          'Das ist schwerer, als es klingt, weil beide Hände mit derselben Kraft drücken wollen. Unabhängige Lautstärkekontrolle zwischen den Händen ist eine eigene Fähigkeit und braucht gezieltes Üben.',
          'Ein nützlicher Test: Nehmen Sie sich auf und hören Sie zurück. Fast alle sind überrascht, wie laut ihre linke Hand ist.',
        ],
      },
      { title: 'Den Unterschied hören', body: ['Derselbe Akkord mit Melodieton, zuerst alles gleich laut, dann die Begleitung deutlich leiser.'] },
      {
        title: 'Wie man das übt',
        body: [
          'Übertreiben Sie. Spielen Sie die Begleitung so leise, wie das Instrument es zulässt, und halten Sie die Melodie auf normaler Lautstärke. Es wird sich absurd anfühlen. Nehmen Sie es dann zurück, bis es natürlich klingt — und Sie landen ungefähr richtig.',
          'Es hilft auch, die Melodie allein zu spielen und dann die andere Hand hinzuzunehmen, während Sie den Klang festhalten, den die Melodie allein hatte.',
        ],
      },
      { title: 'An einem Stück üben', body: ['Das Menuett in {note:G} hat eine klare Melodie über einer leichten linken Hand. Die linke soll da sein, aber nie im Weg.'] },
    ],
  },

  // == Abschnitt 12: jenseits der Noten =====================================

  'x-chord-symbols': {
    title: 'Akkordsymbole und Lead Sheets',
    summary: 'Wie der größte Teil der nichtklassischen Musik tatsächlich notiert wird.',
    steps: [
      {
        title: 'Eine Melodie und ein paar Buchstaben',
        body: [
          'Außerhalb der Klassik sind die meisten Noten **Lead Sheets**: eine einzelne Melodielinie mit Akkordsymbolen darüber. Was Sie darunter spielen, entscheiden Sie.',
          'Das Symbol nennt Grundton und Qualität. Ein bloßer Buchstabe heißt Durdreiklang. **m** macht ihn zu Moll, **7** zum Dominantseptakkord, **maj7** zum großen Septakkord, **m7** zum Moll-Septakkord, **dim** oder **aug** verändern die Quinte.',
          'Ein Schrägstrich gibt einen bestimmten Bass an: {note:C}/{note:E} ist ein {note:C}-Dur-Akkord mit {note:E} unten — also die erste Umkehrung.',
        ],
      },
      { title: 'F', body: ['Ein bloßer Buchstabe: ein einfacher Durdreiklang auf {note:F}.'], prompt: 'Spielen Sie den Akkord' },
      { title: 'Dm', body: ['Das m heißt Moll: {note:D} {note:F} {note:A}.'], prompt: 'Spielen Sie den Akkord' },
      { title: 'G7', body: ['Ein Dominantseptakkord: {note:G} {note:B} {note:D} {note:F}.'], prompt: 'Spielen Sie den Akkord' },
      {
        question: 'Was bedeutet das Akkordsymbol {note:C}/{note:G}?',
        options: [
          'Nur {note:C} und {note:G} spielen',
          'Zwischen {note:C}- und {note:G}-Akkord wechseln',
          'Ein {note:C}-Dur-Akkord mit {note:G} im Bass',
          'Ein {note:C}-Akkord rechts und {note:G} links',
        ],
        explain: 'Der Buchstabe nach dem Schrägstrich ist der Basston. {note:C}/{note:G} ist {note:C}-Dur in zweiter Umkehrung.',
      },
    ],
  },

  'x-accompaniment': {
    title: 'Begleitmuster',
    summary: 'Vier Wege, denselben Akkord in vier verschiedene Stile zu kleiden.',
    steps: [
      {
        title: 'Dieselbe Harmonie, andere Kleidung',
        body: [
          'Sobald Sie Akkordsymbole lesen, stellt sich die Frage, was Sie tatsächlich spielen. Der Akkord nennt die Töne; das **Muster** bestimmt den Stil.',
          'Ein Blockakkord auf jedem Schlag klingt nach Choral. In ein Alberti-Muster gebrochen klingt er klassisch. Grundton-Quinte im Bass mit Akkorden auf den Nachschlägen klingt nach Country oder Folk. Ein tiefer Grundton und darüber ein Akkord ist das Stride-Muster hinter altem Jazz und Ragtime.',
          'Drei oder vier Muster zu lernen und sie auf jeden Akkord anwenden zu können ist mehr wert, als drei oder vier Stücke zu lernen.',
        ],
      },
      { title: 'Alberti', body: ['Unten, oben, Mitte, oben — das klassische Muster.'], prompt: 'Spielen Sie das Muster' },
      { title: 'Grundton und Oktave', body: ['Grundton, Oktave darüber, Quinte, Oktave — ein einfaches, treibendes Muster, das in fast jedem Stil funktioniert.'], prompt: 'Spielen Sie das Muster' },
      { title: 'Weiter Stride', body: ['Ein tiefer Basston, dann der Akkord anderthalb Oktaven höher. Halten Sie den Sprung locker und schauen Sie dorthin, wohin Sie springen.'], prompt: 'Spielen Sie das Muster' },
      { title: 'An einem Stück üben', body: ['„Auld Lang Syne“ hat einfache Harmonie und viel Luft. Spielen Sie die Melodie und probieren Sie in jeder Strophe ein anderes Muster in der linken Hand.'] },
    ],
  },

  'x-blues': {
    title: 'Der Zwölftakt-Blues',
    summary: 'Drei Akkorde, zwölf Takte und rund ein Jahrhundert Musik.',
    steps: [
      {
        title: 'Die Form',
        body: [
          'Der Blues ist ein Schema aus zwölf Takten mit nur I, IV und V. In {note:C}: vier Takte I, zwei Takte IV, zwei Takte I, ein Takt V, ein Takt IV und zum Schluss zwei weitere Takte I.',
          'Jeder Akkord wird meist als **Dominantseptakkord** gespielt, auch die Tonika — was theoretisch falsch ist und genau deshalb nach Blues klingt.',
          'Wer die Form kennt, kann mit jedem spielen, der sie ebenfalls kennt, in jeder Tonart, ohne Noten. Das ist der Hauptgrund, sie zu lernen.',
        ],
      },
      { title: 'I7', body: ['{note:C} {note:E} {note:G} {note:B}.'], prompt: 'Spielen Sie den Septakkord auf {note:I}' },
      { title: 'IV7', body: ['{note:F} {note:A} {note:C} {note:E}s.'], prompt: 'Spielen Sie den Septakkord auf {note:IV}' },
      { title: 'V7', body: ['{note:G} {note:B} {note:D} {note:F}.'], prompt: 'Spielen Sie den Septakkord auf {note:V}' },
      { title: 'Die ganzen zwölf Takte', body: ['Ein vollständiger Blueschorus mit Walking Bass. Hören Sie ihn erst im Zuhörmodus an und steigen Sie dann ein.'] },
    ],
  },

  'x-improvising': {
    title: 'Ihre erste Improvisation',
    summary: 'Fünf Töne, die nicht falsch klingen können, über einer Form, die Sie kennen.',
    steps: [
      {
        title: 'Die Blues-Tonleiter',
        body: [
          'Die **Moll-Pentatonik** auf {note:C} lautet {note:C} {note:E}s {note:F} {note:G} {note:B}. Fügen Sie {note:G}es als Durchgangston hinzu, und Sie haben die **Blues-Tonleiter**.',
          'Über einem Blues in {note:C} funktioniert jeder dieser Töne zu allen drei Akkorden. Es gibt nichts zu vermeiden, Sie können also aufhören, sich vor falschen Tönen zu fürchten, und anfangen zuzuhören.',
          'Improvisieren heißt nicht, viele Töne zu spielen. Es heißt, eine kurze Idee zu spielen und ihr zu antworten — dieselbe Form von Frage und Antwort wie in einem Gespräch.',
        ],
      },
      { title: 'Die Tonleiter', body: ['Sechs Töne aufwärts. Lernen Sie den Griff so, dass Sie nicht hinsehen müssen.'], prompt: 'Spielen Sie die Blues-Tonleiter' },
      {
        title: 'Wie man anfängt',
        body: [
          'Geben Sie sich Regeln, die es leichter machen, nicht schwerer. Nehmen Sie **nur drei Töne**. Spielen Sie eine kurze Phrase, lassen Sie eine ebenso lange Lücke und spielen Sie dann etwas, das antwortet.',
          'Der Rhythmus zählt mehr als die Tonhöhen. Ein langweiliger Rhythmus auf interessanten Tönen klingt schlechter als ein interessanter Rhythmus auf drei Tönen.',
          'Lassen Sie Raum. Anfänger füllen jeden Schlag; erst der Raum macht aus Tönen Phrasen.',
        ],
      },
      { title: 'Über den Blues spielen', body: ['Starten Sie den Zwölftakt-Blues im Zuhörmodus und improvisieren Sie mit der rechten Hand über diesen Tönen. Nichts davon kann falsch sein.'] },
    ],
  },

  'x-by-ear': {
    title: 'Nach Gehör spielen',
    summary: 'Musik ohne Noten herausfinden.',
    steps: [
      {
        title: 'Zuerst die Tonart finden',
        body: [
          'Nach Gehör zu spielen ist keine Zauberei, sondern eine durch Wissen eingegrenzte Suche. Beginnen Sie mit dem **Grundton**: Summen Sie die Melodie und suchen Sie den Ton, auf dem sie sich zu Ende anfühlt.',
          'Entscheiden Sie dann Dur oder Moll, indem Sie die Terz darüber probieren. Eine von beiden klingt sofort richtig.',
          'Jetzt haben Sie eine Tonleiter, und die Melodie benutzt fast sicher nur diese sieben Töne. Aus achtundachtzig Tasten sind sieben geworden.',
        ],
      },
      { title: 'Eine kurze Phrase nachspielen', body: ['Vier Töne: hinauf, hinauf, zurück zum Anfang. Spielen Sie sie, summen Sie sie, und finden Sie sie dann anderswo auf der Klaviatur wieder.'], prompt: 'Spielen Sie die Phrase' },
      { title: 'Dieselbe Form, verschoben', body: ['Genau dieselbe Form, beginnend auf {note:F}. Sobald Sie Intervalle statt Tonnamen hören, ist das Verschieben trivial — und genau das ist Transponieren.'], prompt: 'Spielen Sie die Phrase' },
      {
        title: 'Dann die Akkorde suchen',
        body: [
          'Für die Harmonie probieren Sie zuerst I — er stimmt häufiger als alles andere. Passt er nicht, probieren Sie V, dann IV. Diese drei decken die meisten einfachen Lieder ab, und sobald zwei falsch klingen, ist der dritte meist richtig.',
          'Trainieren Sie das direkt in der Gehörbildungsübung. Intervalle und Akkordqualitäten sind genau das, was Sie zu erkennen versuchen.',
        ],
      },
      {
        question: 'Was ist der nützlichste erste Schritt, wenn man eine Melodie nach Gehör herausfindet?',
        options: [
          'Die schnellste Stelle suchen',
          'Den letzten Akkord bestimmen',
          'Den Grundton finden und Dur oder Moll entscheiden',
          'Den Rhythmus aufschreiben',
        ],
        explain: 'Die Tonart festzulegen reduziert achtundachtzig Tasten auf sieben Töne, und alles danach geht viel schneller.',
      },
    ],
  },

  'x-routine': {
    title: 'Wie es weitergeht',
    summary: 'Ein Übeplan, den Sie durchhalten, und was danach zu lernen ist.',
    steps: [
      {
        title: 'Ein Plan, der den Alltag übersteht',
        body: [
          'Zwanzig bis dreißig Minuten am Tag schlagen drei Stunden am Sonntag. Die Häufigkeit zählt mehr als die Länge, denn motorische Fähigkeiten festigen sich zwischen den Einheiten, nicht während ihnen.',
          'Eine brauchbare Aufteilung: fünf Minuten Technik (eine Tonleiter und ein Arpeggio in einer Tonart), zehn Minuten an der schwersten Stelle des Stücks, das Sie gerade lernen, fünf Minuten Blattspiel von etwas Leichtem und Neuem, der Rest Spielen zum Vergnügen.',
          'Der letzte Teil ist nicht optional. Jahrzehntelang spielen die, denen das Spielen Freude macht, nicht die mit der besten Disziplin.',
        ],
      },
      {
        title: 'Bleiben Sie bei den Übungen',
        body: [
          'Die vier Übungen dieser App sind an den meisten Tagen ein paar Minuten wert. Besonders Blattspiel und Gehörbildung summieren sich — ein Jahr mit je fünf Minuten täglich bringt mehr als jedes Pauken.',
          'Lesen Sie Musik vom Blatt, die **leichter ist als Ihr Spielniveau**. Es geht um Flüssigkeit, nicht um Schwierigkeit. Wenn Sie anhalten und rechnen müssen, ist es zu schwer.',
        ],
      },
      {
        title: 'Was als Nächstes',
        body: [
          'Lernen Sie alle zwölf Durtonleitern, dann die Molltonleitern. Das klingt nach Plackerei und öffnet mehr Repertoire als alles andere: Stücke hören auf, Tonfolgen zu sein, und werden zu Mustern, die Sie schon kennen.',
          'Danach: Bachs kleine Präludien und das Notenbüchlein für Anna Magdalena, Schumanns „Album für die Jugend“, Burgmüllers op. 100 und die leichteren Préludes von Chopin. Für Nichtklassisches: ein paar Begleitmuster und das Spielen nach Lead Sheets.',
          'Und suchen Sie sich Leute zum Zusammenspielen. Nichts verbessert das Zeitgefühl so sehr wie die Notwendigkeit, mit jemandem Schritt zu halten.',
        ],
      },
      {
        title: 'Noch eines',
        body: [
          'Fortschritt am Klavier verläuft nicht geradlinig. Sie werden wochenlang das Gefühl haben festzustecken, und dann wird ohne Vorwarnung leicht, was unmöglich war. So funktioniert das Lernen — die Festigung geschieht still, während Sie nicht hinsehen.',
          'Wenn Sie frustriert sind, spielen Sie etwas, das Sie vor drei Monaten gelernt haben. Das ist der deutlichste Beweis, den Sie haben, dass es funktioniert.',
        ],
      },
    ],
  },
};
