import fs from "node:fs";
import path from "node:path";

const ROOT = "/workspace";
const SRC = path.join(ROOT, "src/lib/manifold/data/lexicon.ts");
const OUT = path.join(ROOT, "src/lib/manifold/data/lexicon-more.ts");

const existingSrc = fs.readFileSync(SRC, "utf8");
const existing = new Set();
for (const m of existingSrc.matchAll(/"([^"]+)"/g)) {
  existing.add(m[1].toLowerCase().replace(/-/g, " "));
  existing.add(m[1].toLowerCase());
}

const STOP = new Set(
  `the of and to a in is it you that he was for on are as with his they i at be this have from or one had by but not what all were we when your can said there use an each which she do how their if will up other about out many then them these so some her would make like him into has look two more write go see no way could my than first been call who its now find long down day did get come made may part also just over such new after most where back because very good through being those work also only even well want should still something never last between both few any those same another while around however without against during under again each every always three four five six seven eight nine ten yes no ok oh yeah hi hey please thanks thank sorry hello maybe perhaps already actually really quite rather instead whether either neither among within upon onto off our us me him her them myself itself himself herself themselves yourself yourselves a n s t ve re ll d m mr mrs ms dr jr sr st rd nd th com www http https html pdf jpg png gif svg css js php asp net org edu gov mil int co uk us ca au de fr it es ru cn jp kr in br mx za ng ie nl se no fi dk pl cz gr pt hu ro bg hr sk si lt lv ee ie html php pdf`.split(
    /\s+/,
  ),
);

const NAMES = new Set(
  `john david michael james robert paul william thomas richard charles joseph mary jennifer linda patricia susan nancy karen betty helen sandra donna carol ruth sharon michelle laura sarah kimberley jessica amanda melissa deborah stephanie rebecca cynthia kathleen angela shirley anna brenda pamela emily nicole tiffany christina heather denise jane alice judy theresa kathy christina george peter jack harry samuel henry edward frank raymond peter donald kenneth steve andrew justin kevin brian larry scott eric jonathan gary jeffrey benjamin ryan nathan samuel peter china india france germany spain italy japan russia mexico canada brazil australia england ireland scotland wales london paris tokyo berlin rome york california texas florida ohio illinois washington georgia michigan virginia arizona pennsylvania jersey carolina colorado minnesota wisconsin indiana missouri maryland tennessee alabama louisiana kentucky oregon iowa oklahoma mississippi kansas arkansas utah nebraska nevada idaho maine vermont delaware hampshire dakota hawaii alaska york google yahoo microsoft apple samsung sony nokia motorola paypal ebay amazon facebook twitter youtube wikipedia linux java html cnet xbox ipod phentermine`.split(
    /\s+/,
  ),
);

const RULES = [
  ["viscera", /blood|bone|organelle|^organ$|organs|heart|lung|^liver$|nerve|flesh|vein|artery|arterial|arteriole|muscle|tissue|spleen|kidney|stomach|brain|skull|spine|joint|tooth|teeth|^mouth$|throat|^nose$|finger|^hand$|hands|^foot$|feet|^body$|bodies|^pain$|painful|wound|bleed|pulse|cardio|hepato|neuro|dermato|osteo|itis$|emia$|cyte$|gland|hormone|tumor|virus|bacter|infect|fever|cough|sweat|saliva|marrow|tendon|ligament|cartilage|diaphragm|bladder|colon|appendix|retina|cornea|^iris$|pupil|cochlea|alveol|bronch|capillar|aorta|atrium|ventric|septum|pericard|pleura|ganglion|synapse|axon|dendrite|myelin|cortex|pituitary|adrenal|thyroid|thymus|ulna|tibia|fibula|scapula|clavicle|sternum|sacrum|mandible|patella|plasma|platelet|fibrin|collagen|keratin|mucus|abscess|ulcer|edema|hematoma|bruise|^scar$|scars|keloid|blister|callus|follicle|cuticle|dermis|epidermis|navel|sinus|otolith|uvula|jejunum|ileum|cecum|duodenum|pylorus|suture|lymph|bile|pancrea|trachea|larynx|pharynx|esophag|intestine|tonsil|sclera|eardrum|tympan|peritoneum|omentum|mesenter|cerebell|hypothal|hyoid|calcane|talus|metacar|phalanx|sesamoid|synov|bursa|meniscus|labrum|periost|osteocyte|chondro|hemoglobin|myoglobin|elastin|sebum|necrosis|infarct|ischemia|fistula|^wart$|freckle|^pore$|cutis|hypoderm|keratinocyte|melanocyte|umbilic|fontanel|palatine|turbinate|antrum|mastoid|utricle|saccule/],
  ["weather", /storm|cloud|^wind$|windy|windstorm|^snow$|snowy|snowfall|^fog$|foggy|^hail$|frost|thunder|lightning|weather|climate|humid|drought|flood|^gale$|breeze|^mist$|^dew$|sleet|blizzard|tornado|hurricane|cyclone|monsoon|atmospher|squall|zephyr|sirocco|mistral|chinook|whiteout|graupel|^rime$|hoarfrost|^haar$|brume|virga|doldrum|isobar|isotherm|dewpoint|mammatus|contrail|nacreous|noctilucent|^halo$|sundog|microburst|downburst|whirlwind|waterspout|cloudburst|deluge|petrichor|stratus|nimbo|cumulo|cirrus|altocumulus|^thaw$|permafrost|meltwater|runoff|flash.?flood|storm.?surge|seiche|occluded|jet.?stream|(^|-)rain(s|y|fall|drop|bow)?$|(^|-)ice$/],
  ["machines", /gear|cog|piston|valve|motor|engine|machine|bearing|clutch|brake|rotor|stator|pulley|sprocket|ratchet|cam\b|crank|flywheel|solenoid|actuator|relay|caliper|armature|commutator|bushing|shim|washer|spline|sheave|belt|chain|damper|spring|gimbal|coupling|flange|gasket|impeller|nozzle|venturi|manifold|muffler|turbo|throttle|injector|lathe|mill|reamer|collet|chuck|jig|fixture|gauge|micrometer|rivet|punch|conveyor|hopper|auger|turbine|compressor|pump|cylinder|bore|stroke|governor|escapement|pawl|pinion|dashpot|torsion|universal|o-ring|bellows|volute|diffuser|orifice|plenum|resonator|carburetor|choke|fusee|pallet|shaper|planer|broach|mandrel|template|feeler|swage|die.?set|geneva|yoke|stirling|atkinson/],
  ["office", /office|paper|file|form|stamp|memo|invoice|ledger|docket|agenda|minutes|quorum|proxy|ballot|affidavit|notary|folio|carbon|triplicate|mimeograph|stencil|inbox|outbox|cabinet|folder|binder|clip|staple|paperclip|blotter|archive|microfiche|rolodex|directory|switchboard|timesheet|budget|requisition|permit|license|charter|bylaw|ordinance|statute|waiver|indemnity|shred|notari|apostille|retention|destruction|circular|addendum|annex|errata|corrigendum|frank|postage|pendaflex|manila|rubber.?band|sticky|in-tray|suspense|fiche|cardex|dial.?tone|busy.?signal|punch.?clock|cost.?center|purchase.?order|packing.?list|waybill|manifest|customs|visa|red.?tape|signature|wet.?ink|certification/],
  ["organisms", /animal|creature|^beast$|mammal|^bird$|^fish$|reptile|amphibian|predator|^prey$|^host$|parasite|symbiont|scavenger|ruminant|marsupial|cetacean|pinniped|hyena|jackal|^dingo$|coyote|^lynx$|bobcat|ocelot|okapi|tapir|capybara|^vole$|^shrew$|platypus|echidna|pangolin|aardvark|wombat|koala|^sloth$|armadillo|anteater|lemur|^loris$|tarsier|gibbon|orangutan|axolotl|^newt$|salamander|tuatara|^skink$|gecko|iguana|chameleon|condor|albatross|petrel|puffin|^swift$|kestrel|merlin|goshawk|harrier|heron|egret|^ibis$|^stork$|^crane$|cormorant|pelican|gannet|cuttlefish|nautilus|barnacle|tunicate|hagfish|lamprey|tardigrade|rotifer|nematode|^whale$|dolphin|^shark$|^wolf$|^fox$|^bear$|^deer$|^moose$|^elk$|^bison$|^otter$|beaver|badger|weasel|ferret|^mink$|raccoon|^skunk$|opossum|squirrel|rabbit|^hare$|^mouse$|^rat$|^bat$|^owl$|^hawk$|^eagle$|falcon|^crow$|^raven$|sparrow|^finch$|^wren$|thrush|warbler|^duck$|^goose$|^swan$|^frog$|^toad$|^snake$|lizard|turtle|crocodile|alligator|spider|scorpion|^crab$|lobster|shrimp|oyster|mussel|^clam$|^snail$|^slug$|^worm$|^coral$|^sponge$|jellyfish|starfish|^urchin$|anemone/],
  ["physics", /inertia|momentum|impulse|torque|vector|scalar|tensor|gradient|entropy|enthalpy|capacitance|inductance|impedance|resonance|harmonic|overtone|diffraction|refraction|interference|polariz|coheren|entangle|tunnel|planck|boltzmann|lorentz|coriolis|bernoulli|archimedes|modulus|plasticity|elastic|hysteresis|diffusion|osmosis|conduction|radiation|blackbody|emissiv|albedo|sublimat|nucleation|supercool|metastab|quantum|photon|electron|proton|neutron|^atom$|atomic|molecule|nucleus|isotope|^ions?$|plasma|vacuum|velocity|acceleration|gravity|relativity|thermodynam|kinetic|joule|newton|kelvin|celsius|wavelength|spectrum|photon|wavelength|inertia|torque|viscoelastic|buckling|endurance.?limit|mean.?free|brownian|electrophoresis|triple.?point|critical.?mass|critical.?angle|phase.?change|superheating|bistability/],
  ["architecture", /lintel|soffit|cornice|entablature|frieze|pediment|keystone|buttress|cloister|transept|^nave$|^apse$|narthex|clerestory|cupola|pendentive|squinch|portico|colonnade|loggia|arcade|pilaster|plinth|wainscot|mullion|transom|threshold|^jamb$|newel|baluster|riser|^tread$|cantilever|eaves|parapet|crenel|^keep$|bailey|^motte$|postern|hypocaust|atrium|facade|gable|dormer|spire|steeple|belfry|ambulatory|triforium|^lantern$|rib.?vault|fan.?vault|barrel.?vault|peristyle|^stoa$|chair.?rail|muntin|sidelight|fanlight|stringer|nosing|landing|dogleg|bargeboard|copestone|merlon|bartizan|palisade|cloaca|impluvium|cathedral|chapel|basilica|rotunda|courtyard|refectory|scriptorium|undercroft|^crypt$|sacristy|westwork/],
  ["domestic", /house|home|room|kitchen|bedroom|bathroom|closet|attic|basement|porch|garage|toaster|kettle|iron|dustpan|broom|mop|sponge|doormat|nightstand|dresser|wardrobe|mattress|pillow|duvet|comforter|quilt|radiator|thermostat|chimney|mailbox|doorbell|deadbolt|curtain|sofa|couch|armchair|ottoman|bookshelf|cabinet|drawer|shelf|sink|faucet|stove|oven|fridge|freezer|dishwasher|washer|dryer|vacuum|laundry|hamper|hanger|ironing|clothespin|tea.?towel|dishcloth|colander|whisk|spatula|ladle|cutting.?board|spice|utensil|coatrack|hatstand|chiffonier|armoire|bedskirt|sham|afghan|window.?sash|flue|andiron|knickknack|curio|knocker|peephole|weatherstrip|draft|door.?sweep|blanket|sheet|towel|napkin|placemat|coaster|lamp|lightbulb|switch|outlet|plug|extension.?cord/],
  ["cloth", /cloth|fabric|textile|weave|warp|weft|selvedge|bias|nap|pile|twill|satin|denim|canvas|muslin|calico|chintz|voile|organza|chiffon|crepe|tulle|gauze|felt|tweed|serge|gabardine|corduroy|velvet|velour|terry|pique|brocade|damask|jacquard|tapestry|lace|embroidery|pleat|ruffle|hem|lining|seam|buttonhole|grommet|cotton|wool|silk|linen|nylon|polyester|rayon|spandex|knit|crochet|stitch|thread|yarn|spool|bobbin|needle|thimble|pattern|dart|tuck|gather|flounce|facing|interfacing|overlock|serger|eyelet|lacing|stay|herringbone|houndstooth|gingham|chambray|drill|duck|osnaburg|toile|georgette|charmeuse|netting|mesh|cheesecloth|homespun|whipcord|velveteen|ottoman|filet|smocking|shirring|pintuck|gore|godet|allowance|selvage|raw.?edge|frog.?closure|toggle/],
  ["optics", /lens|prism|optic|aperture|focus|focal|image.?plane|aberration|coma|astigmatism|vignetting|chromatic|birefring|dichroic|polarizer|waveplate|interferometer|speckle|caustic|airy|diffraction|fresnel|fraunhofer|huygens|brewster|snell|pinhole|camera|moire|photon|photon|mirror|refraction|reflection|photon|photon|laser|hologram|photon|iris|diaphragm|shutter|exposure|f-stop|bokeh|flare|glare|beam|ray|photon|wavelength|spectrum|infrared|ultraviolet|x-ray|gamma|photon|microscope|telescope|binocular|eyepiece|objective|collimat|grating|etalon|fabry|michelson|wollaston|nicol|quarter.?wave|half.?wave|evanescent|thin.?film|anti.?reflection|blooming|camera.?obscura|lucida/],
  ["geology", /rock|stone|mineral|stratum|fault|fold|anticline|syncline|granite|basalt|limestone|sandstone|shale|slate|schist|gneiss|obsidian|pumice|tuff|marble|quartzite|conglomerate|breccia|chalk|flint|jasper|agate|karst|sinkhole|esker|drumlin|moraine|till|loess|volcano|magma|lava|tectonic|earthquake|seismic|sediment|erosion|weathering|canyon|cliff|ridge|peak|summit|glacier|fjord|mesa|butte|plateau|valley|gully|ravine|crevasse|unconformity|horst|graben|thrust|cleavage|foliation|phyllite|mudstone|siltstone|arkose|graywacke|tillite|dolomite|marl|coquina|chert|chalcedony|andesite|dacite|rhyolite|scoria|ignimbrite|gabbro|diorite|granodiorite|pegmatite|peridotite|dunite|kimberlite|eclogite|laterite|bauxite|saprolite|doline|polje|kame|outwash|varve|lamina|hiatus|reverse.?fault|strike.?slip|monocline|recumbent|lineation|schistosity/],
  ["water", /river|lake|ocean|^sea$|stream|creek|brook|^pond$|thalweg|oxbow|meander|levee|estuary|fjord|strait|undertow|swash|backwash|^fetch$|whitecap|^swell$|brackish|halocline|thermocline|upwelling|^tide$|^weir$|^sluice$|culvert|aquifer|artesian|^seep$|cenote|harbor|^bay$|^gulf$|inlet|^cove$|lagoon|marsh|swamp|wetland|^delta$|tributary|confluence|headwater|^shore$|^beach$|^coast$|^reef$|^atoll$|reservoir|waterfall|cascade|rapids|whirlpool|maelstrom|iceberg|^vapor$|^steam$|droplet|ripple|bow.?wave|^neap$|caisson|cofferdam|outfall|aquitard|vadose|phreatic|blue.?hole/],
  ["heat", /ember|cinder|clinker|^slag$|^dross$|^forge$|crucible|^kiln$|^temper$|^quench$|calcin|sinter|vitrify|^weld$|pyrometer|thermocouple|heatsink|refractory|firebrick|furnace|^smelt$|molten|scorch|^sear$|conflagration|kindling|^tinder$|firebox|^muffle$|^retort$|anneal|carburize|nitrid|^bluing$|bimetal|kaowool|tuyere|^billet$|^ingot$|mill.?scale|cherry.?red|straw.?yellow/],
  ["time", /pendulum|chronometer|deadline|latency|jitter|syncopation|rubato|fermata|caesura|anacrusis|sidereal|ephemeris|julian|gregorian|fortnight|curfew|vespers|matins|lauds|^nones$|arrears|deferral|hemiola|polyrhythm|tenuto|duration|interval|^tempo$|epoch|decade|century|millennium|moment|instant|afterward|yesterday|tomorrow|tonight|^dawn$|^dusk$|^noon$|midnight|twilight|solstice|equinox|analemma|lustrum|olympiad|indiction|sennight|dogwatch|liturgical|beat.?note|going.?train|hour.?wheel|mean.?time|solar.?day/],
  ["damage", /fracture|^crack$|fissure|^spall$|delamination|pitting|corrosion|galling|seizing|^dent$|^ding$|^crease$|^tear$|puncture|splinter|^shard$|^sliver$|^chip$|^nick$|^gouge$|^scratch$|^scuff$|^rust$|^rot$|mildew|foxing|cockling|fray|unravel|shatter|smash|crush|collapse|wreck|wreckage|debris|rubble|^leak$|^burst$|^snap$|buckle|^warp$|^twist$|^bend$|crumble|decay|degrade|^scar$|^bruise$|corrode|oxidize|tarnish|blight|^mold$|moth.?hole|acid.?hole|fatigue.?crack|stress.?corrosion|beach.?mark|striation|necking|cavitation|fretting|scoring|cupping|oil.?canning|run.?ladder|dry.?rot|wet.?rot|tide.?line/],
  ["plants", /xylem|phloem|cambium|meristem|stoma|petiole|bract|rhizome|stolon|tuber|^corm$|lignin|cellulose|transpir|vernaliz|etiolation|thigmo|gravitro|nastic|phyllotaxy|whorled|decussate|^oak$|^pine$|^maple$|^birch$|^cedar$|^willow$|^poplar$|^spruce$|^hemlock$|redwood|sequoia|^palm$|bamboo|^fern$|^moss$|lichen|^algae$|fungus|mushroom|toadstool|^spore$|mycelium|^vine$|^ivy$|^grass$|^weed$|^herb$|^shrub$|^hedge$|orchard|blossom|^bud$|^shoot$|sprout|sapling|^stump$|^timber$|lumber|sawdust|acorn|^nectar$|^pitch$|lenticel|stipule|spathe|involucre|capitulum|raceme|panicle|^cyme$|^umbel$|catkin|spadix|adventitious|taproot|pneumatophore|haustorium|mycorrhiza|pectin|suberin|alkaloid|guttation|abscission|senescence|photoperiod|dormancy/],
  ["insects", /insect|^bug$|beetle|^ant$|^bee$|^wasp$|hornet|yellowjacket|termite|cockroach|cricket|grasshopper|locust|cicada|aphid|^moth$|butterfly|caterpillar|^larva$|^pupa$|^nymph$|dragonfly|damselfly|mayfly|stonefly|caddisfly|lacewing|mantis|earwig|silverfish|^flea$|^louse$|^tick$|^mite$|centipede|millipede|elytron|haltere|spiracle|frass|chrysalis|cocoon|instar|ecdysis|exuviae|ovipositor|stridulation|pheromone|^swarm$|^drone$|ommatidium|pronotum|scutellum|puparium|aedeagus|spermatheca|tymbal|royal.?jelly|nuptial|parasitoid|aposematism|mimicry|tegmen|hamulus|malpighian|proventriculus/],
  ["ritual", /rite|ritual|liturgy|ceremony|altar|temple|shrine|chapel|prayer|hymn|chant|psalm|gospel|creed|sacrament|baptism|communion|eucharist|mass|vespers|matins|vigil|fast|pilgrim|relic|icon|incense|censer|thurible|chasuble|alb|stole|crozier|mitre|pallium|chalice|pyx|monstrance|tabernacle|iconostasis|rood|antiphon|responsory|gradual|introit|kyrie|gloria|credo|sanctus|agnus|dismissal|holy.?water|aspergillum|maniple|cincture|amice|dalmatic|feretory|lustration|libation|votive|hecatomb|scapegoat|pharmakos|liminal|host.?wafer|ember.?day|rogation|canonical|office.?hour|censer|incense.?boat|aspersorium|reliquary|waystation|threshold.?rite/],
  ["language", /phoneme|morpheme|lexeme|grapheme|allophone|infix|clitic|anaphora|deixis|synecdoche|metonymy|litotes|zeugma|chiasmus|aporia|ellipsis|enjambment|volta|dactyl|spondee|hexameter|pentameter|kenning|hapax|palimpsest|palindrome|lipogram|acrostic|calque|loanword|solecism|malaprop|mondegreen|eggcorn|glottal|^schwa$|etymology|thesaurus|lexicon|vocabulary|^slang$|^jargon$|^idiom$|^proverb$|metaphor|^simile$|^irony$|sarcasm|^pun$|^riddle$|^stanza$|^lyric$|^sonnet$|^haiku$|^elegy$|^ballad$|^canto$|couplet|quatrain|^sestet$|^octave$|caesura|anacoluthon|aposiopesis|cataphora|allomorph|circumfix|enclitic|proclitic|occupatio|praeteritio|inkhorn|folk.?etymology/],
  ["sleep", /sleep|dream|nap|doze|siesta|insomnia|nightmare|snore|yawn|drowsy|tired|fatigue|rest|awake|waking|hypnagog|hypnopomp|myoclonus|hypnic|atonia|paralysis|lucid|somnambul|somniloqu|apnea|hypopnea|circadian|ultradian|melatonin|adenosine|inertia|microsleep|catnap|pillow|blanket|bed|night|midnight|nocturnal|rem\b|nrem|slow.?wave|delta.?sleep|spindle|k.?complex|cheyne|cortisol|sleep.?pressure|sleep.?debt|second.?wind|false.?awakening|bed.?spin|sheet.?crease|night.?sweat|night.?terror/],
  ["food", /roux|emulsion|vinaigrette|mayonnaise|confit|rillettes|mirepoix|sofrito|aspic|terrine|maillard|caramel|chocolate|yogurt|^dough$|^yeast$|^flour$|saute|braise|^poach$|blanch|pickle|ferment|^brine$|^simmer$|^grill$|^bake$|^roast$|^fry$|^stew$|^broth$|^stock$|deglaze|^fond$|bouquet.?garni|sachet|gelee|^skim$|ice.?bath|carryover|seed.?crystal|liaison|^nappe$|pellicle|^autolyse$|lamination|holy.?trinity|^umami$|leftover/],
  ["math", /algebra|geometry|calculus|^theorem$|^lemma$|^axiom$|eigen|determinant|jacobian|hessian|cokernel|homomorphism|isomorphism|monoid|semigroup|ultrafilter|^sheaf$|holomorphic|meromorphic|singularity|riemann|logarithm|exponent|factorial|permutation|combination|probability|variance|deviation|correlation|regression|algorithm|polynomial|convergence|divergence|differentiable|analytic|cotangent|topology|manifold/],
  ["weapons", /sword|knife|blade|spear|axe|bow|arrow|shield|armor|gun|rifle|pistol|cannon|bullet|shell|bomb|mine|dagger|rapier|saber|scimitar|katana|machete|hatchet|halberd|pike|lance|mace|flail|whip|sling|crossbow|quarrel|bolt|fuller|tang|ricasso|quillon|pommel|scabbard|chape|nock|fletching|bodkin|touchhole|frizzen|sear|trigger|rifling|ogive|meplat|sabot|glaive|voulge|tiller|lath|prod|windlass|cranequin|pollaxe|bill.?hook|staff.?sling|sling.?stone|helical|boat.?tail|discarding|hair.?trigger|set.?trigger|lockplate|tumbler|matchcord|serpentine|pan.?flash|barbed|frog.?belt|locket|grip.?wrap|land.?groove|twist.?rate/],
  ["electric", /electric|voltage|ampere|coulomb|^watt$|^ohm$|circuit|battery|transformer|capacitor|inductor|resistor|transistor|^diode$|switchgear|varistor|arrestor|^shunt$|rogowski|semiconductor|germanium|electrode|electrolyte|inverter|rectifier|oscillator|amplifier|waveguide|^coax$|twisted.?pair|photodiode|busbar|farad|^henry$|siemens|eddy.?current|skin.?effect|magnetostriction/],
  ["waste", /trash|garbage|refuse|rubbish|^junk$|^scrap$|tailings|leachate|landfill|compost|septic|sewer|^offal$|sawdust|^swarf$|midden|sewage|effluent|contaminat|^toxic$|dumpster|throwaway|castoff|offcut|residue|^sludge$|^scum$|^dregs$|^lees$|^marc$|pomace|^chaff$|stubble|manure|^guano$|^dung$|droppings|carrion|carcass|fly-ash|bottom-ash|vermicompost|cesspool|honeywagon|methane/],
  ["labor", /piecework|timework|overtime|clocking|timecard|steward|grievance|arbitration|lockout|walkout|speedup|^scrip$|pay.?envelope|docked|foreman|apprentice|journeyman|indenture|brigade|^crew$|timesheet|hazard.?pay|piece.?rate|stopwatch|taylorism|fordism|closed.?shop|open.?shop|right.?to.?work|sit.?down|stretch.?out|company.?town|shift.?differential|time.?motion|union.?card|shop.?steward|^picket$|quota/],
  ["childhood", /^child$|children|^kid$|kids|^toy$|toys|^doll$|marbles|^jacks$|hopscotch|skipping|hide-and-seek|stickball|stoopball|thumb-war|cootie|fortune-teller|paper-airplane|slingshot|mud-pie|sand-castle|dandelion|wishbone|training-wheel|playground|^swing$|^slide$|seesaw|sandbox|crayon|^chalk$|sticker|lollipop|^candy$|^cookie$|^nap$|recess|kindergarten|nursery|lullaby|bedtime|^teddy$|rattle|pacifier|diaper|stroller|highchair|sippy|alphabet|peekaboo|double-dutch|cat-cradle|freeze-tag/],
  ["signal", /signal|radio|broadcast|transmit|receive|carrier|sideband|baseband|pilot|subcarrier|heterodyne|mixer|oscillator|phase.?noise|bit.?error|packet|dropout|fade|multipath|doppler|equalizer|handshake|checksum|parity|hamming|reed.?solomon|interleaving|constellation|eye.?diagram|bandwidth|frequency|channel|noise|static|hiss|hum|whine|chirp|beep|tone|modem|telegraph|morse|cipher|encrypt|decrypt|protocol|header|payload|latency|jitter|throughput|baud|modulation|spread.?spectrum|ethernet|gateway|repeater|antenna|feedhorn|waveguide|coax|twinax|photodiode|rake|allan|rayleigh|rician|intersymbol|bathtub|homodyne|if.?stage|local.?oscillator/],
  ["minerals", /quartz|feldspar|mica|amphibole|pyroxene|olivine|garnet|calcite|aragonite|gypsum|anhydrite|barite|halite|sylvite|fluorite|apatite|tourmaline|beryl|corundum|spinel|magnetite|hematite|goethite|limonite|pyrite|marcasite|chalcopyrite|galena|sphalerite|cinnabar|malachite|azurite|turquoise|jadeite|nephrite|talc|graphite|diamond|coal|anthracite|amber|crystal|gem|jewel|ruby|sapphire|emerald|topaz|amethyst|opal|jade|onyx|pearl|coral|ivory|jet|obsidian|flint|chert|agate|jasper|carnelian|bloodstone|moonstone|sunstone|labradorite|amazonite|rhodonite|rhodochrosite|smithsonite|wulfenite|vanadinite|crocoite|realgar|orpiment|stibnite|molybdenite|wolframite|cassiterite|rutile|ilmenite|chromite|pyrolusite|psilomelane|bauxite|cryolite|borax|kernite|ulexite|colemanite|nitratine|thenardite|trona|nahcolite|dolomite|siderite|magnesite|rhodochrosite|witherite|strontianite|cerussite|malachite|azurite|cuprite|tenorite|native|nugget|vein|lode|ore|gangue|tailing|concentrate|smelter|ingot|bullion/],
  ["rare", /apophenia|pareidolia|palimpsest|sonder|limerence|ambedo|chrysalism|kenopsia|onism|anemoia|monachopsis|altschmerz|occhiolism|vellichor|hiraeth|saudade|duende|sprezzatura|wabi|sabi|kintsugi|\bma\b|yugen|komorebi|ikigai|tsundoku|meraki|gluggavedur|kowhaiwhai|cwtch|brumous|crepuscular|penumbra|umbra|antumbra|syzygy|aphelion|perihelion|lagrange|barycenter|roche|cherenkov|hawking|casimir|unruh|zeno|theseus|qualia|hapax|apophasis|occupatio|praeteritio|aposiopesis|petrichor|liminal|numinous|ineffable|eldritch|uncanny|sublime|sunder|threnody|elegiac|sough|susurrus|crepitus|psithurism|aphotic|benthic|hadal|nacreous|opalescent|iridescent|lambent|fulgent|refulgent|effulgent|penumbral|crepuscule|gloaming|eventide|nocturne|aubade|serenade|threnody|dirge|requiem|orison|obsecration|beseech|soughing|horripilation|piloerection|synesthesia|ideasthesia|jamais|vu\b|presque|vu\b|cryptomnesia|hypermnesia|anosognosia|prosopagnosia|aphasia|apraxia|agnosia|syncope|catalepsy|catatonia|akathisia|dystonia|myoclonus|fasciculation|paresthesia|dysesthesia|allodynia|hyperalgesia|hypoesthesia/],
];

function classify(word) {
  const w = word.toLowerCase();
  for (const [fam, re] of RULES) {
    if (re.test(w)) return fam;
  }
  return "common";
}

function keep(word) {
  const w = word.toLowerCase().trim();
  if (w.length < 3 || w.length > 18) return false;
  if (/\d/.test(w)) return false;
  if (!/^[a-z][a-z-]*[a-z]$/.test(w) && !/^[a-z]{3,}$/.test(w)) return false;
  if (STOP.has(w)) return false;
  if (NAMES.has(w)) return false;
  if (/(sex|porn|xxx|nude|viagra|cialis|fuck|shit|dick|cock|pussy|anal|hentai|webcam|milf|sperm|jizz|handjob|blowjob|bangbus|squirt|dildo|erotic|nsfw)/.test(w)) return false;
  if (existing.has(w) || existing.has(w.replace(/-/g, " "))) return false;
  if (/ing$/.test(w) && existing.has(w.slice(0, -3))) return false;
  if (/ed$/.test(w) && existing.has(w.slice(0, -2))) return false;
  if (/s$/.test(w) && existing.has(w.slice(0, -1))) return false;
  return true;
}

const bags = Object.fromEntries(
  [
    "viscera","weather","machines","office","organisms","physics","architecture",
    "domestic","cloth","optics","geology","water","heat","time","damage","plants",
    "insects","ritual","language","sleep","food","math","weapons","electric",
    "waste","labor","childhood","signal","minerals","rare","common",
  ].map((k) => [k, []]),
);

const seen = new Set();

function add(word, family) {
  const w = word.toLowerCase().replace(/_/g, "-");
  if (!keep(w) || seen.has(w)) return;
  if (family === "common" && bags.common.length >= 4200) return;
  seen.add(w);
  bags[family].push(w);
}

const twenty = fs.readFileSync("/tmp/words/20k.txt", "utf8").split(/\s+/).filter(Boolean);
const long = fs.readFileSync("/tmp/words/long.txt", "utf8").split(/\s+/).filter(Boolean);
const medium = fs.readFileSync("/tmp/words/medium.txt", "utf8").split(/\s+/).filter(Boolean);
const twentyIndex = new Map(twenty.map((w, i) => [w.toLowerCase(), i]));

for (const w of [...medium, ...long]) {
  if (!keep(w)) continue;
  add(w, classify(w));
}
for (const w of twenty) {
  if (!keep(w)) continue;
  let fam = classify(w);
  const rank = twentyIndex.get(w.toLowerCase()) ?? 0;
  if (fam === "common" && rank >= 8500 && w.length >= 5) fam = "rare";
  add(w, fam);
}

const counts = Object.fromEntries(Object.entries(bags).map(([k, v]) => [k, v.length]));
const total = Object.values(bags).reduce((a, b) => a + b.length, 0);

const body = `// Auto-generated extra lexicon (merged with data/lexicon.ts).
export const LEXICON_MORE: Record<string, string[]> = {
${Object.entries(bags)
  .map(([k, words]) => `  ${k}: ${JSON.stringify(words)},`)
  .join("\n")}
};

export const LEXICON_MORE_COUNT = ${total};
`;

fs.writeFileSync(OUT, body);
console.log(JSON.stringify({ total, counts, out: OUT }, null, 2));
