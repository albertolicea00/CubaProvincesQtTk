"""Province -> municipality data repository for Cuba.

Aggregates the per-province municipality lists from the sibling
``municipality_*`` modules and exposes them through the
``Provinces_Municipaly`` class. Provinces are ordered roughly west to east.
"""
from base.municipality_Artemisa import *
from base.municipality_Camaguey import *
from base.municipality_CiegodeAvila import *
from base.municipality_Cienfuegos import *
from base.municipality_Granma import *
from base.municipality_Guantanamo import *
from base.municipality_Holguin import *
from base.municipality_IsladelaJuventud import *
from base.municipality_LaHabana import *
from base.municipality_LasTunas import *
from base.municipality_Matanzas import *
from base.municipality_Mayabeque import *
from base.municipality_PinardelRio import *
from base.municipality_SanctiSpiritus import *
from base.municipality_SantiagodeCuba import *
from base.municipality_VillaClara import *


class Provinces_Municipaly():
    """Repository of Cuban provinces and their municipalities.

    Each province exposes its municipality list through a dedicated read-only
    property (e.g. ``Artemisa``, ``LaHabana``). ``provinces`` returns the
    ordered display names; ``municipality`` returns every municipality flat.
    """

    def __init__(self):
        # Full province set, ordered west -> east. Maps the display name shown
        # in the combo box to the municipality list imported from its module.
        # NOTE: the "Isla de la Juventud**" key keeps its trailing "**" marker;
        # it is what the province combo box actually displays.
        self.__provinces = {

            "Isla de la Juventud**": municipality_IsladelaJuventud,
            "Pinar del Rio": municipality_PinardelRio,
            "Artemisa": municipality_Artemisa,
            "La Habana": municipality_LaHabana,
            "Mayabeque": municipality_Mayabeque,
            "Matanzas": municipality_Matanzas,
            "Cienfuegos": municipality_Cienfuegos,
            "Villa Clara": municipality_VillaClara,
            "Sancti Spíritus": municipality_SanctiSpiritus,
            "Ciego de Ávila": municipality_CiegodeAvila,
            "Camagüey": municipality_Camaguey,
            "Las Tunas": municipality_LasTunas,
            "Granma": municipality_Granma,
            "Holguín": municipality_Holguin,
            "Santiago de Cuba": municipality_SantiagodeCuba,
            "Guantánamo": municipality_Guantanamo,

        }
        # Regional groupings, kept for reference. Not used by the public API.
        self.__provinces_West = {
            "Isla de la Juventud": municipality_IsladelaJuventud,
            "Pinar del Rio": municipality_PinardelRio,
            "Artemisa": municipality_Artemisa,
            "La Habana": municipality_LaHabana,
            "Mayabeque": municipality_Mayabeque,
            "Matanzas": municipality_Matanzas,
        }
        self.__provinces_Center = {
            "Cienfuegos": municipality_Cienfuegos,
            "Villa Clara": municipality_VillaClara,
            "Sancti Spíritus": municipality_SanctiSpiritus,
            "Ciego de Ávila": municipality_CiegodeAvila,
        }
        self.__provinces_East = {
            "Camagüey": municipality_Camaguey,
            "Las Tunas": municipality_LasTunas,
            "Granma": municipality_Granma,
            "Holguín": municipality_Holguin,
            "Santiago de Cuba": municipality_SantiagodeCuba,
            "Guantánamo": municipality_Guantanamo,
        }

    @property
    def provinces(self):
        """Province display names, ordered west to east."""
        return list(self.__provinces)

    @property
    def municipality(self):
        """Every municipality across all provinces, as one flat list.

        FIXME: indexes "Isla de la Juventud" but the dict key is
        "Isla de la Juventud**", so this raises KeyError as written.
        """
        return    self.__provinces["Isla de la Juventud"]    \
                + self.__provinces["Pinar del Rio"]           \
                + self.__provinces["Artemisa"]                \
                + self.__provinces["La Habana"]               \
                + self.__provinces["Mayabeque"]               \
                + self.__provinces["Matanzas"]                \
                + self.__provinces["Cienfuegos"]              \
                + self.__provinces["Villa Clara"]             \
                + self.__provinces["Sancti Spíritus"]         \
                + self.__provinces["Ciego de Ávila"]          \
                + self.__provinces["Las Tunas"]               \
                + self.__provinces["Camagüey"]                \
                + self.__provinces["Granma"]                  \
                + self.__provinces["Holguín"]                 \
                + self.__provinces["Santiago de Cuba"]        \
                + self.__provinces["Guantánamo"]

    # ------------------------------------------------------------------
    # Per-province accessors (one read-only property each)
    # ------------------------------------------------------------------

    @property
    def IsladelaJuventud(self):
        """Municipalities of Isla de la Juventud."""
        return self.__provinces["Isla de la Juventud**"]

    @property
    def PinardelRio(self):
        """Municipalities of Pinar del Río."""
        return self.__provinces["Pinar del Rio"]

    @property
    def Artemisa(self):
        """Municipalities of Artemisa."""
        return self.__provinces["Artemisa"]

    @property
    def LaHabana(self):
        """Municipalities of La Habana."""
        return self.__provinces["La Habana"]

    @property
    def Mayabeque(self):
        """Municipalities of Mayabeque."""
        return self.__provinces["Mayabeque"]

    @property
    def Matanzas(self):
        """Municipalities of Matanzas."""
        return self.__provinces["Matanzas"]

    @property
    def Cienfuegos(self):
        """Municipalities of Cienfuegos."""
        return self.__provinces["Cienfuegos"]

    @property
    def VillaClara(self):
        """Municipalities of Villa Clara."""
        return self.__provinces["Villa Clara"]

    @property
    def SanctiSpiritus(self):
        """Municipalities of Sancti Spíritus."""
        return self.__provinces["Sancti Spíritus"]

    @property
    def CiegodeAvila(self):
        """Municipalities of Ciego de Ávila."""
        return self.__provinces["Ciego de Ávila"]

    @property
    def Camaguey(self):
        """Municipalities of Camagüey."""
        return self.__provinces["Camagüey"]

    @property
    def LasTunas(self):
        """Municipalities of Las Tunas."""
        return self.__provinces["Las Tunas"]

    @property
    def Granma(self):
        """Municipalities of Granma."""
        return self.__provinces["Granma"]

    @property
    def Holguin(self):
        """Municipalities of Holguín."""
        return self.__provinces["Holguín"]

    @property
    def SantiagodeCuba(self):
        """Municipalities of Santiago de Cuba."""
        return self.__provinces["Santiago de Cuba"]

    @property
    def Guantanamo(self):
        """Municipalities of Guantánamo."""
        return self.__provinces["Guantánamo"]
